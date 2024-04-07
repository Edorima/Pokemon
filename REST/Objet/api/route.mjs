"use strict"

import express from 'express'
import objetController from "./controller/objetController.mjs"

const router = express.Router()

/**
 * Une route permettant de récupérer une liste d'{@link Objet}.
 * Plusieurs paramètres optionnel peuvent être passé.
 * @param req.query.categorie {string} - La catgorie que l'objet doit avoir.
 * @param req.query.limit {string} - Le nombre de résultat voulu.
 * @param req.query.offset {string} - Exclu les N premiers objet de la réponse.
 * @send 200 - Une liste d'objet correspondant aux paramètres.
 */
router.route('/objet').get(async (req, res) => {
    const categorie = parseInt(req.query.categorie)
    const limit = parseInt(req.query.limit)
    const offset = parseInt(req.query.offset)
    res.status(200).send(await objetController.getItems(categorie, limit, offset))
})


/**
 * Une route permettant de récupérer une liste d'{@link Objet}
 * dont le nom commence par un terme de recherche passé en paramètre.
 * Plusieurs paramètres optionnel peuvent être passé.
 * @param req.params.searchTerm {string} - Le terme de recherche avec lequel rechercher.
 * @param req.query.categorie {string} - La catgorie que l'objet doit avoir.
 * @param req.query.limit {string} - Le nombre de résultat voulu.
 * @param req.query.offset {string} - Exclu les N premiers objet de la réponse.
 * @send 200 - Une liste d'objet correspondant aux paramètres commençant par {@link searchTerm}.
 */
router.route('/objet/startsWith/:searchTerm').get(async (req, res) => {
    const searchTerm = req.params.searchTerm
    const categorie = parseInt(req.query.categorie)
    const limit = parseInt(req.query.limit)
    const offset = parseInt(req.query.offset)
    res.status(200).send(await objetController.findItemsThatStartsWith(
        searchTerm, categorie, limit, offset
    ))
})

export default router