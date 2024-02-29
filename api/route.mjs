"use strict"

import express from 'express'
import pokemonDAO from "./dao/pokemonDAO.mjs";
const router = express.Router()

router
    .route('/')
        .get(async (req, res) => {
            res.status(200).send("Hello World !")
        })

router
    .route('/pokemon/:nameOrId')
        .get(async (req, res) => {
            const nameOrId = req.params.nameOrId
            const result = await pokemonDAO.findPokemonById(nameOrId)
            if (result)
                res.status(200).send(result)
            else
                res.status(404).send("Not Found")
        })

export default router