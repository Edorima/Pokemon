"use strict"

import express from 'express'
import utilisateurController from "./controller/utilisateurController.mjs"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const router = express.Router()

/**
 * Permet de signer un pseudo et d'en renvoyer un token.
 * @param pseudo {string} - Le pseudo à signer
 * @returns {string} - Un token de validation
 */
function signPayload(pseudo) {
    return jwt.sign(
        { pseudo: pseudo },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    )
}

// Middleware pour valider le token et attacher les données utilisateur à la requête
async function validateUserToken(req, res, next) {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) return res.status(401).send({success: false, message: 'Token manquant'})
        const userPayload = jwt.verify(token, process.env.SECRET_KEY)
        // Attacher l'utilisateur à l'objet de requête pour un accès ultérieur
        req.user = await utilisateurController.getUser(userPayload.pseudo)
        next() // Passer au prochain middleware / route handler
    } catch (error) {
        return res.status(401).send({success: false, message: 'Token invalide'})
    }
}

/**
 * Une route permettant à un {@link Utilisateur} de se créer un compte.
 * Les informations de l'utilisateur sont dans le corps de la requête.
 * @send 201 - L'utilisateur a bien été créé. Donne un jeton d'authentification.
 * @send 400 - Erreur, l'utilisateur n'a pas été crée. Donne la raison.
 */
router.route('/register').post(async (req, res) => {
    try {
        const utilisateur = await utilisateurController.addUser(req.body)
        res.status(201).send({success: true, token: signPayload(utilisateur.pseudo)})
    } catch (e) {
        res.status(400).json({success: false, message: e})
    }
})


/**
 * Une route permettant à un {@link Utilisateur} de s'authentifier.
 * Les informations de l'utilisateur sont dans le corps de la requête.
 * @send 200 - L'utilisateur est reconnu. Donne un jeton d'authentification.
 * @send 401 - Erreur, le mot de passe est incorrect.
 * @send 404 - Erreur, l'utilisateur n'existe pas.
 */
router.route('/login').post(async (req, res) => {
    const pseudo = req.body.pseudo
    const motDePasse = req.body.motDePasse

    const utilisateur = await utilisateurController.getUser(pseudo)
    if (!utilisateur)
        return res.status(404).send({success: false, message: "L'utilisateur n'existe pas"})

    const mdpValide = await bcrypt.compare(motDePasse, utilisateur.motDePasse)
    if (!mdpValide)
        return res.status(401).send({success: false, message: "Mot de passe incorrect"})

    res.status(200).send({ success: true, token: signPayload(pseudo) })
})

router.route('/profil')
    /**
     * Permet d'obtenir le profil d'un {@link Utilisateur}.
     * @send 200 - Les données de l'utilisateur (sans le mot de passe).
     */
    .get(validateUserToken, async (req, res) => {
        const userData = req.user
        delete userData.motDePasse
        res.status(200).send(userData)
    })


    /**
     * Permet d'ajouter une {@link Equipe} de Pokémon
     * au profil d'un {@link Utilisateur}.
     * @send 201 - L'équipe a bien été créé.
     * @send 400 - Erreur, l'équipe n'est pas valide.
     * @send 409 - Erreur, l'équipe existe déjà.
     */
    .post(validateUserToken, async (req, res) => {
        try {
            await utilisateurController.addTeam(req.user.pseudo, req.body)
            res.status(201).send({success: true, message: 'Équipe créée'})
        } catch (e) {
            if (e ===  "L'équipe existe déjà")
                res.status(409).send({success: false, message: e})
            else
                res.status(400).send({
                    success: false, message: 'Équipe invalide'
                })
        }
    })


    /**
     * Permet de modifier une {@link Equipe} de Pokémon
     * du profil d'un {@link Utilisateur}.
     * @send 200 - La requête a été prise en compte,
     * mais aucune modification n'a été apportée.
     * @send 204 - L'équipe a bien été modifiée.
     * Rien n'est envoyé de plus.
     * @send 400 - Les Pokémon modifié de l'équipe sont invalides.
     * @send 404 - L'équipe n'existe pas.
     */
    .put(validateUserToken, async (req, res) => {
        try {
            const updated = await utilisateurController.editTeam(
                req.user.pseudo,
                req.body.nomActuel,
                req.body.pokemons,
                req.body.nouveauNom
            )

            if (updated)
                res.status(204).send()
            else
                res.status(200).send({
                    success: true, message: 'Aucune mise à jour effectuée'
                })
        } catch (e) {
            if (e === "L'équipe n'existe pas")
                res.status(404).send({
                    success: false, message: e
                })
            else
                res.status(400).send({
                    success: false, message: 'Pokemons invalide'
                })
        }
    })


    /**
     * Permet de supprimer une {@link Equipe}
     * du profil d'un {@link Utilisateur}.
     * @send 204 - L'équipe a bien été supprimé.
     * Rien n'est envoyé de plus.
     * @send 404 - L'équipe n'existe pas.
     */
    .delete(validateUserToken, async (req, res) => {
        try {
            await utilisateurController.deleteTeam(req.user.pseudo, req.body.nomEquipe)
            res.status(204).send()
        } catch (e) {
            res.status(404).send({success: false, message: e})
        }
    })

export default router