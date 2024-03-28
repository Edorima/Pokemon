"use strict"

import {MongoClient} from "mongodb"
import Pokemon from "../model/Pokemon.mjs"
import capaciteDAO from "./capaciteDAO.mjs";

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017'
const LIMIT = 20

function normalizeString(str) {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
}

const pokemonDAO = {
    /**
     * Établit une connexion à la collection 'pokemon' dans MongoDB pour les opérations CRUD.
     */
    get collection() {
        const client = new MongoClient(dbUrl)
        const db = client.db("pokemanager")
        return db.collection('pokemon')
    },

    /**
     * Récupère les Pokémon filtrés par génération avec pagination.
     * @param generation {number} - La génération des Pokémon à filtrer.
     * @param limit {number} - Limite le nombre de résultats retournés.
     * @param offset {number} - Définit le point de départ des résultats.
     * @returns {Promise<Pokemon[]>} - Une promesse qui résout en un tableau de Pokémon.
     */
    getPokemons: async (generation, limit, offset) => {
        const data = await pokemonDAO.collection.find(
            Number.isInteger(generation) ? {generation: generation} : {},
            {projection: {_id: 0}, limit: limit || LIMIT, skip: offset || 0}
        )
        return (await data.toArray()).map(e => new Pokemon(e))
    },

    /**
     * Trouve un Pokémon spécifique par son identifiant.
     * @param id {number} - L'identifiant du Pokémon à trouver.
     * @returns {Promise<Pokemon | null>} - Une promesse qui résout en un Pokémon trouvé ou null.
     */
    findPokemonById: async (id) => {
        const data = await pokemonDAO.collection.findOne(
            {id: id},
            {projection: {_id: 0}}
        )
        return data ? new Pokemon(data) : null
    },

    /**
     * Trouve des Pokémon dont le nom normalisé commence par un terme de recherche spécifié, optionnellement filtré par génération, avec pagination.
     * @param searchTerm {string} - Le terme de recherche pour le début du nom du Pokémon.
     * @param generation {number} - La génération des Pokémon à filtrer.
     * @param limit {number} - Limite le nombre de résultats.
     * @param offset {number} - Définit le point de départ pour les résultats.
     * @returns {Promise<Pokemon[]>} - Une promesse qui résout en un tableau de Pokémon correspondants.
     */
    findPokemonsThatStartsWith: async (searchTerm, generation, limit, offset) => {
        const filter = {nomNormalise: new RegExp('^' + normalizeString(searchTerm))}
        if (Number.isInteger(generation))
            filter.generation = generation

        const data = await pokemonDAO.collection.find(
            filter,
            {projection: {_id: 0}, limit: limit || LIMIT, skip: offset || 0, sort: {id: 1}}
        )
        return (await data.toArray()).map(e => new Pokemon(e))
    },

    /**
     * Trouve des Pokémon capables d'apprendre une capacité spécifique par l'ID de la capacité.
     * @param moveId {number} - L'identifiant de la capacité pour filtrer les Pokémon qui peuvent l'apprendre.
     * @returns {Promise<Pokemon[]>} - Une promesse qui résout en un tableau de Pokémon pouvant apprendre la capacité spécifiée.
     */
    findPokemonsByMove: async (moveId) => {
        const move = await capaciteDAO.findMoveById(moveId)
        const data = await pokemonDAO.collection.find(
            {nomAnglais: {$in: move.pokemons}},
            {projection: {_id: 0}}
        )
        return (await data.toArray()).map(e => new Pokemon(e))
    }
}

export default pokemonDAO