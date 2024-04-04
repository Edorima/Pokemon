"use strict"

import express from 'express'
import utilisateurController from "./controller/utilisateurController.mjs"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const router = express.Router()

/**
 * Permet de signer un pseudo et d'en renvoyer un token.
 * @param pseudo {string}
 * @returns {string}
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

router.route('/register').post(async (req, res) => {
    try {
        const utilisateur = await utilisateurController.addUser(req.body)
        res.status(201).send({success: true, token: signPayload(utilisateur.pseudo)})
    } catch (e) {
        res.status(400).json({success: false, message: e})
    }
})

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
    .get(validateUserToken, async (req, res) => {
        const userData = req.user
        delete userData.motDePasse
        res.status(200).send(userData)
    })
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
                res.status(200).send(
                    {success: true, message: 'Aucune mise à jour effectuée'}
                )
        } catch (e) {
            if (e === "L'équipe n'existe pas")
                res.status(404).send(
                    {success: false, message: e}
                )
            else
                res.status(400).send({
                    success: false, message: 'Pokemons invalide'
                })
        }
    })
    .delete(validateUserToken, async (req, res) => {
        try {
            await utilisateurController.deleteTeam(req.user.pseudo, req.body.nomEquipe)
            res.status(204).send()
        } catch (e) {
            res.status(404).send({success: false, message: e})
        }
    })

export default router