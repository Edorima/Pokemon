"use strict"

import express from 'express'
import capaciteController from "./controller/capaciteController.mjs"

const router = express.Router()

router.route('/capacite').get(async (req, res) => {
    const type = req.query.type
    const categorie = req.query.categorie
    const limit = parseInt(req.query.limit)
    const offset = parseInt(req.query.offset)
    res.status(200).send(await capaciteController.getMoves(type, categorie, limit, offset))
})

router.route('/capacite/startsWith/:searchTerm').get(async (req, res) => {
    const searchTerm = req.params.searchTerm
    const type = req.query.type
    const categorie = req.query.categorie
    const limit = parseInt(req.query.limit)
    const offset = parseInt(req.query.offset)
    const result = await capaciteController.findMovesThatStartsWith(
        searchTerm, type, categorie, limit, offset
    )
    if (result)
        res.status(200).send(result)
    else
        res.status(404).send("Not Found")
})

router.route('/capacite/:id').get(async (req, res) =>  {
    const id = parseInt(req.params.id)
    const result = await capaciteController.findMoveById(id)
    if (result)
        res.status(200).send(result)
    else
        res.status(404).send({message: "Move Not Found"})
})

router.route('/capacite/ofPokemon/:id').get(async (req, res) => {
    const pkmId = parseInt(req.params.id)
    const result = await capaciteController.findMovesByPokemon(pkmId)
    if (result)
        res.status(200).send(result)
    else
        res.status(404).send("Not Found")
})

export default router