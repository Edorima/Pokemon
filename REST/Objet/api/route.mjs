"use strict"

import express from 'express'
import objetController from "./controller/objetController.mjs"

const router = express.Router()

router.route('/objet').get(async (req, res) => {
    const categorie = parseInt(req.query.categorie)
    const limit = parseInt(req.query.limit)
    const offset = parseInt(req.query.offset)
    res.status(200).send(await objetController.getItems(categorie, limit, offset))
})

router.route('/objet/startsWith/:searchTerm').get(async (req, res) => {
    const searchTerm = req.params.searchTerm
    const categorie = parseInt(req.query.categorie)
    const limit = parseInt(req.query.limit)
    const offset = parseInt(req.query.offset)
    const result = await objetController.findItemsThatStartsWith(
        searchTerm, categorie, limit, offset
    )
    if (result)
        res.status(200).send(result)
    else
        res.status(404).send("Not Found")
})

export default router