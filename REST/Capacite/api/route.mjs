"use strict"

import express from 'express'
import capaciteController from "./controller/capaciteController.mjs"

const router = express.Router()

/**
 * Une route permettant de récupérer une liste de {@link Capacite}.
 * Plusieurs paramètres optionnel peuvent être passé.
 * @param req.query.type {string} - Le type que la capacité doit avoir.
 * @param req.query.categorie {string} - La catégorie que la capacité doit avoir.
 * @param req.query.limit {string} - Le nombre de résultat voulu.
 * @param req.query.offset {string} - Exclu les N premières capacité de la réponse.
 * @send 200 - Une liste de capacité correspondant aux paramètres.
 */
router.route('/capacite').get(async (req, res) => {
    const type = req.query.type
    const categorie = req.query.categorie
    const limit = parseInt(req.query.limit)
    const offset = parseInt(req.query.offset)
    res.status(200).send(await capaciteController.getMoves(type, categorie, limit, offset))
})


/**
 * Une route permettant de récupérer une {@link Capacite}
 * en particulière grâce à son {@link id}.
 * @param req.params.id {string} - L'identifiant de la capacité à rechercher.
 * @send 200 - Une capacité.
 * @send 404 - Erreur, la capacité n'a pas été trouvé.
 */
router.route('/capacite/:id').get(async (req, res) =>  {
    const id = parseInt(req.params.id)
    const result = await capaciteController.findMoveById(id)
    if (result)
        res.status(200).send(result)
    else
        res.status(404).send({message: "Move Not Found"})
})


/**
 * Une route permettant de récupérer une liste de capacité dont le nom commence
 * par un terme de recherche passé en paramètre.
 * Plusieurs paramètres optionnel peuvent être passé.
 * @param req.params.searchTerm {string} - Le terme de recherche avec lequel rechercher.
 * @param req.query.type {string} - Le type que la capacité doit avoir.
 * @param req.query.categorie {string} - La catégorie que la capacité doit avoir.
 * @param req.query.limit {string} - Le nombre de résultat voulu.
 * @param req.query.offset {string} - Exclu les N premières capacité de la réponse.
 * @send 200 - Une liste de capacité correspondant aux paramètres commençant par {@link searchTerm}.
 */
router.route('/capacite/startsWith/:searchTerm').get(async (req, res) => {
    const searchTerm = req.params.searchTerm
    const type = req.query.type
    const categorie = req.query.categorie
    const limit = parseInt(req.query.limit)
    const offset = parseInt(req.query.offset)
    res.status(200).send(await capaciteController.findMovesThatStartsWith(
        searchTerm, type, categorie, limit, offset
    ))
})


/**
 * Une route permettant de récupérer la liste des capacités
 * qu'un pokémon en particulier peut apprendre grâce à son {@link id}.
 * @param req.params.id {string} - L'identifiant du pokémon.
 * @send 200 - La liste des capacités que peut apprendre un pokémon.
 * @send 404 - Erreur, le pokémon n'existe pas.
 */
router.route('/capacite/ofPokemon/:id').get(async (req, res) => {
    const pkmId = parseInt(req.params.id)
    const result = await capaciteController.findMovesByPokemon(pkmId)
    if (result)
        res.status(200).send(result)
    else
        res.status(404).send({message: 'Pokemon Not Found'})
})

export default router