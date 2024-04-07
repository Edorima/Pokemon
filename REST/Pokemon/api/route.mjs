"use strict"

import express from 'express'
import pokemonController from "./controller/pokemonController.mjs"

const router = express.Router()

/**
 * Une route permettant de récupérer une liste de {@link Pokemon}.
 * Plusieurs paramètres optionnel peuvent être passé.
 * @param req.query.type1 {string} - Le type que le pokémon doit avoir.
 * @param req.query.type2 {string} - Un deuxième type optionnel que le pokémon
 * doit avoir également. {@link type1} doit être présent.
 * @param req.query.gen {string} - La génération du pokémon.
 * @param req.query.limit {string} - Le nombre de résultat voulu.
 * @param req.query.offset {string} - Exclu les N premiers pokémon de la réponse.
 * @send 200 - Une liste de pokémon correspondant aux paramètres.
 * @send 400 - Erreur, le {@link type1} est manquant.
 */
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


/**
 * Une route permettant de récupérer un {@link Pokemon}
 * en particulier grâce à son {@link id}.
 * @param req.params.id {string} - L'identifiant du pokémon à rechercher.
 * @send 200 - Un pokémon.
 * @send 404 - Erreur, le pokémon n'a pas été trouvé.
 */
router.route('/pokemon/:id').get(async (req, res) =>  {
    const pkmId = parseInt(req.params.id)
    const result = await pokemonController.findPokemonById(pkmId)
    if (result)
        res.status(200).send(result)
    else
        res.status(404).send({message: 'Pokemon Not Found'})
})


/**
 * Une route permettant de récupérer une liste de {@link Pokemon}
 * dont le nom commence par un terme de recherche passé en paramètre.
 * Plusieurs paramètres optionnel peuvent être passé.
 * @param req.query.type1 {string} - Le type que le pokémon doit avoir.
 * @param req.query.type2 {string} - Un deuxième type optionnel que le pokémon
 * doit avoir également. {@link type1} doit être présent.
 * @param req.params.searchTerm {string} - Le terme de recherche avec lequel rechercher.
 * @param req.query.gen {string} - La génération du pokémon.
 * @param req.query.limit {string} - Le nombre de résultat voulu.
 * @param req.query.offset {string} - Exclu les N premiers pokémon de la réponse.
 * @send 200 - Une liste de pokémon correspondant aux paramètres commençant par {@link searchTerm}.
 * @send 400 - Erreur, le {@link type1} est manquant.
 */
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


/**
 * Une route permettant de récupérer les {@link Pokemon} qui peuvent apprendre
 * une capacité en particulière grâce à son {@link id}.
 * @param req.params.id {string} - L'identifiant de la capacité.
 * @send 200 - La liste des pokémon pouvant apprendre la capacité.
 * @send 404 - Erreur, la capacité n'existe pas.
 */
router.route('/pokemon/withMove/:id').get(async (req, res) => {
    try {
        const moveId = parseInt(req.params.id)
        res.status(200).send(
            await pokemonController.findPokemonsByMove(moveId)
        )
    } catch (e) {
        res.status(404).send({message: e})
    }
})

export default router