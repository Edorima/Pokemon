"use strict"

import express from 'express'
import pokemonController from "./controller/pokemonController.mjs"

const router = express.Router()

router.route('/pokemon').get(async (req, res) => {
    const type1 = req.query.type1
    const type2 = req.query.type2
    if (!type1 && type2) {
        res.status(400).send({message: 'type1 missing'})
        return
    }
    const generation = parseInt(req.query.gen)
    const limit = parseInt(req.query.limit)
    const offset = parseInt(req.query.offset)

    res.status(200).send(
        await pokemonController.getPokemons(
            generation, type1, type2, limit, offset
    ))
})

router.route('/pokemon/:id').get(async (req, res) =>  {
    const pkmId = parseInt(req.params.id)
    const result = await pokemonController.findPokemonById(pkmId)
    if (result)
        res.status(200).send(result)
    else
        res.status(404).send({message: 'Pokemon Not Found'})
})

router.route('/pokemon/startsWith/:searchTerm').get(async (req, res) => {
    const type1 = req.query.type1
    const type2 = req.query.type2
    if (!type1 && type2) {
        res.status(400).send({message: 'type1 missing'})
        return
    }
    const searchTerm = req.params.searchTerm
    const generation = parseInt(req.query.gen)
    const limit = parseInt(req.query.limit)
    const offset = parseInt(req.query.offset)

    res.status(200).send(
        await pokemonController.findPokemonsThatStartsWith(
            searchTerm, generation, type1, type2, limit, offset
    ))
})

router.route('/pokemon/withMove/:id').get(async (req, res) => {
    const moveId = parseInt(req.params.id)
    const result = await pokemonController.findPokemonsByMove(moveId)
    if (result)
        res.status(200).send(result)
    else
        res.status(404).send({message: 'Move Not Found'})
})

export default router