"use strict"

import express from 'express'
import pokemonDAO from "./dao/pokemonDAO.mjs";
import capacityDAO from "./dao/capacityDAO.mjs";
import utilisateurDAO from "./dao/utilisateurDAO.mjs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import itemDAO from "./dao/itemDAO.mjs";
const router = express.Router()

function validateToken(req) {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) throw new Error('Token manquant ou invalide.')
    return jwt.verify(token, process.env.SECRET_KEY)
}

router.route('/').get(async (req, res) => {
    res.send("<h1>Welcome on PokéManager API !</h1>")
})

router.route('/pokemon').get(async (req, res) => {
    const limit = Number.parseInt(req.query.limit)
    const offset = Number.parseInt(req.query.offset)
    res.status(200).send(await pokemonDAO.getPokemons(limit, offset))
})

router.route('/pokemon/:nameOrId').get(async (req, res) => {
    const nameOrId = req.params.nameOrId
    const result = await pokemonDAO.findPokemonByNameOrId(nameOrId)
    if (result)
        res.status(200).send(result)
    else
        res.status(404).send("Not Found")
})

router.route('/pokemon/startsWith/:searchTerm').get(async (req, res) => {
    const searchTerm = req.params.searchTerm
    const limit = Number.parseInt(req.query.limit)
    const offset = Number.parseInt(req.query.offset)
    const result = await pokemonDAO.findPokemonsThatStartsWith(
        searchTerm, limit, offset
    )
    if (result)
        res.status(200).send(result)
    else
        res.status(404).send("Not Found")
})

router.route('/pokemon/type/:type').get(async (req, res) => {
    const type = req.params.type
    const limit = Number.parseInt(req.query.limit)
    const offset = Number.parseInt(req.query.offset)
    res.status(200).send(
        await pokemonDAO.findPokemonsByType(
            type, limit, offset
        )
    )
})

router.route('/pokemon/type/:type1/:type2').get(async (req, res) => {
    const type1 = req.params.type1
    const type2 = req.params.type2
    const limit = Number.parseInt(req.query.limit)
    const offset = Number.parseInt(req.query.offset)
    res.status(200).send(
        await pokemonDAO.findPokemonsByDoubleType(
            type1, type2, limit, offset
        )
    )
})

router.route('/pokemon/gen/:gen').get(async (req, res) => {
    const generation = Number.parseInt(req.params.gen)
    const limit = Number.parseInt(req.query.limit)
    const offset = Number.parseInt(req.query.offset)
    res.status(200).send(
        await pokemonDAO.findPokemonsByGen(
            generation, limit, offset
        )
    )
})

router.route('/capacite/:nameOrId').get(async (req, res) => {
    const nameOrId = req.params.nameOrId
    const result = await capacityDAO.findMoveByNameOrId(nameOrId)
    if (result)
        res.status(200).send(result)
    else
        res.status(404).send("Not Found")
})

router.route('/item').get(async (req, res) => {
    const limit = Number.parseInt(req.query.limit)
    const offset = Number.parseInt(req.query.offset)
    res.status(200).send(await itemDAO.getItems(limit, offset))
})

router.route('/register').post(async (req, res) => {
    const pseudo = req.body.pseudo
    const motDePasse = req.body.motDePasse
    const utilisateurAjoute = await utilisateurDAO.addUser(
        pseudo, motDePasse
    )

    if (utilisateurAjoute) {
        const token = jwt.sign(
            { pseudo: pseudo },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        )
        res.json({ success: true, token: token })
    } else
        res.status(400).json({ success: false, message: "L'utilisateur existe déjà." })
})

router.route('/login').post(async (req, res) => {
    const pseudo = req.body.pseudo
    const motDePasse = req.body.motDePasse

    const utilisateur = await utilisateurDAO.getUser(pseudo)
    if (!utilisateur) {
        return res.status(401).json({ success: false, message: "L'utilisateur n'existe pas." })
    }

    const mdpValide = await bcrypt.compare(motDePasse, utilisateur.motDePasse)
    if (!mdpValide) {
        return res.status(401).json({ success: false, message: "Mot de passe incorrect." });
    }

    const token = jwt.sign(
        { pseudo: pseudo },
        process.env.SECRET_KEY,
        { expiresIn: '1h' }
    );

    res.json({ success: true, token: token });
})

router.route('/profil').get(async (req, res) => {
    try {
        // Valider le token de l'utilisateur
        const userPayload = validateToken(req);

        const utilisateur = await utilisateurDAO.getUser(userPayload.pseudo);

        if (!utilisateur) {
            return res.status(404).send()
        }

        const { motDePasse, _id, ...userData } = utilisateur;
        res.json(userData);
    } catch (error) {
        res.status(401).send()
    }
})

export default router