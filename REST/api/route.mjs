"use strict"

import express from 'express'
import pokemonDAO from "./dao/pokemonDAO.mjs"
import capaciteDAO from "./dao/capaciteDAO.mjs"
import utilisateurDAO from "./dao/utilisateurDAO.mjs"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import objetDAO from "./dao/objetDAO.mjs"
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
        if (!token) return res.status(401).send('Token manquant ou invalide.')
        const userPayload = jwt.verify(token, process.env.SECRET_KEY)
        const utilisateur = await utilisateurDAO.getUser(userPayload.pseudo)

        if (!utilisateur)
            return res.status(404).send("Utilisateur non trouvé")

        req.user = utilisateur // Attacher l'utilisateur à l'objet de requête pour un accès ultérieur
        next() // Passer au prochain middleware / route handler
    } catch (error) {
        return res.status(401).send("Token invalide")
    }
}

router.route('/pokemon').get(async (req, res) => {
    const type1 = req.query.type1
    const type2 = req.query.type2
    if (!type1 && type2) {
        res.status(400).send('type1 missing.')
        return
    }
    const generation = parseInt(req.query.gen)
    const limit = parseInt(req.query.limit)
    const offset = parseInt(req.query.offset)

    res.status(200).send(
        await pokemonDAO.getPokemons(
            generation, type1, type2, limit, offset
        )
    )
})

router.route('/pokemon/startsWith/:searchTerm').get(async (req, res) => {
    const type1 = req.query.type1
    const type2 = req.query.type2
    if (!type1 && type2) {
        res.status(400).send('type1 missing.')
        return
    }
    const searchTerm = req.params.searchTerm
    const generation = parseInt(req.query.gen)
    const limit = parseInt(req.query.limit)
    const offset = parseInt(req.query.offset)
    const result = await pokemonDAO.findPokemonsThatStartsWith(
        searchTerm, generation, type1, type2, limit, offset
    )
    if (result)
        res.status(200).send(result)
    else
        res.status(404).send("Not Found")
})

router.route('/pokemon/:id').get(async (req, res) =>  {
    const id = parseInt(req.params.id)
    const result = await pokemonDAO.findPokemonById(id)
    if (result)
        res.status(200).send(result)
    else
        res.status(404).send("Not Found")
})

router.route('/pokemon/:id/capacite').get(async (req, res) => {
    const id = parseInt(req.params.id)
    const result = await capaciteDAO.findMovesByPokemon(id)
    if (result)
        res.status(200).send(result)
    else
        res.status(404).send("Not Found")
})

router.route('/capacite').get(async (req, res) => {
    const type = req.query.type
    const categorie = req.query.categorie
    const limit = parseInt(req.query.limit)
    const offset = parseInt(req.query.offset)
    res.status(200).send(await capaciteDAO.getMoves(type, categorie, limit, offset))
})

router.route('/capacite/startsWith/:searchTerm').get(async (req, res) => {
    const searchTerm = req.params.searchTerm
    const type = req.query.type
    const categorie = req.query.categorie
    const limit = parseInt(req.query.limit)
    const offset = parseInt(req.query.offset)
    const result = await capaciteDAO.findMovesThatStartsWith(
        searchTerm, type, categorie, limit, offset
    )
    if (result)
        res.status(200).send(result)
    else
        res.status(404).send("Not Found")
})

router.route('/capacite/:id').get(async (req, res) =>  {
    const id = parseInt(req.params.id)
    const result = await capaciteDAO.findMoveById(id)
    if (result)
        res.status(200).send(result)
    else
        res.status(404).send("Not Found")
})

router.route('/capacite/:id/pokemon').get(async (req, res) => {
    const id = parseInt(req.params.id)
    const result = await pokemonDAO.findPokemonsByMove(id)
    if (result)
        res.status(200).send(result)
    else
        res.status(404).send("Not Found")
})

router.route('/objet').get(async (req, res) => {
    const categorie = parseInt(req.query.categorie)
    const limit = parseInt(req.query.limit)
    const offset = parseInt(req.query.offset)
    res.status(200).send(await objetDAO.getItems(categorie, limit, offset))
})

router.route('/objet/startsWith/:searchTerm').get(async (req, res) => {
    const searchTerm = req.params.searchTerm
    const categorie = parseInt(req.query.categorie)
    const limit = parseInt(req.query.limit)
    const offset = parseInt(req.query.offset)
    const result = await objetDAO.findItemsThatStartsWith(
        searchTerm, categorie, limit, offset
    )
    if (result)
        res.status(200).send(result)
    else
        res.status(404).send("Not Found")
})

router.route('/register').post(async (req, res) => {
    const pseudo = req.body.pseudo
    const motDePasse = req.body.motDePasse
    const utilisateurAjoute = await utilisateurDAO.addUser(
        pseudo, motDePasse
    )
    if (utilisateurAjoute)
        res.json({ success: true, token: signPayload(pseudo) })
    else
        res.status(400).json({ success: false, message: "L'utilisateur existe déjà." })
})

router.route('/login').post(async (req, res) => {
    const pseudo = req.body.pseudo
    const motDePasse = req.body.motDePasse

    const utilisateur = await utilisateurDAO.getUser(pseudo)
    if (!utilisateur)
        return res.status(401).json({ success: false, message: "L'utilisateur n'existe pas." })

    const mdpValide = await bcrypt.compare(motDePasse, utilisateur.motDePasse)
    if (!mdpValide)
        return res.status(401).json({ success: false, message: "Mot de passe incorrect." })

    res.json({ success: true, token: signPayload(pseudo) })
})

router.route('/profil')
    .get(validateUserToken, async (req, res) => {
        const { motDePasse, ...userData } = req.user
        res.json(userData)
    })
    .post(validateUserToken, async (req, res) => {
        const added = await utilisateurDAO.addTeam(req.user.pseudo, req.body.equipe)
        added ? res.status(201).send() : res.status(409).send("Équipe déjà existante ou erreur")
    })
    .put(validateUserToken, async (req, res) => {
        const updated = await utilisateurDAO.editTeam(
            req.user.pseudo,
            req.body.nomActuel,
            req.body.pokemons,
            req.body.nouveauNom
        )
        updated ? res.status(204).send() : res.status(404).send("Équipe non trouvée")
    })
    .delete(validateUserToken, async (req, res) => {
        const deleted = await utilisateurDAO.deleteTeam(req.user.pseudo, req.body.nomEquipe)
        deleted ? res.status(204).send() : res.status(404).send("Équipe non trouvée")
    })

export default router