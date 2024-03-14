"use strict"

import express from 'express'
import pokemonDAO from "./dao/pokemonDAO.mjs";
import capacityDAO from "./dao/capacityDAO.mjs";
const router = express.Router()

router
    .route('/')
        .get(async (req, res) => {
            res.status(200).send("<h1>Welcome on PokéManager API !</h1>")
        })

router
    .route('/pokemon')
        .get(async (req, res) => {
            const limit = Number.parseInt(req.query.limit)
            const offset = Number.parseInt(req.query.offset)
            res.status(200).send(await pokemonDAO.getPokemons(limit, offset))
        })

router
    .route('/pokemon/:nameOrId')
        .get(async (req, res) => {
            const nameOrId = req.params.nameOrId
            const result = await pokemonDAO.findPokemonByNameOrId(nameOrId)
            if (result)
                res.status(200).send(result)
            else
                res.status(404).send("Not Found")
        })

router
    .route('/pokemon/type/:type')
        .get(async (req, res) => {
            const type = req.params.type
            const limit = Number.parseInt(req.query.limit)
            const offset = Number.parseInt(req.query.offset)
            res.status(200).send(
                await pokemonDAO.findPokemonsByType(
                    type, limit, offset
                )
            )
        })

router
    .route('/pokemon/type/:type1/:type2')
        .get(async (req, res) => {
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

router
    .route('/capacite/:nameOrId')
        .get(async (req, res) => {
            const nameOrId = req.params.nameOrId
            const result = await capacityDAO.findMoveByNameOrId(nameOrId)
            if (result)
                res.status(200).send(result)
            else
                res.status(404).send("Not Found")
        })

export default router