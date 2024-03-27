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
    get collection() {
        const client = new MongoClient(dbUrl)
        const db = client.db("pokemanager")
        return db.collection('pokemon')
    },

    /**
     * @param generation {number}
     * @param limit {number}
     * @param offset {number}
     @returns {Promise<Pokemon[]>}
     */
    getPokemons: async (generation, limit, offset) => {
        const data = await pokemonDAO.collection.find(
            Number.isInteger(generation) ? {generation: generation} : {},
            {projection: {_id: 0}, limit: limit || LIMIT, skip: offset || 0}
        )
        return (await data.toArray()).map(e => new Pokemon(e))
    },

    /**
     * @param id {number}
     * @returns {Promise<Pokemon | null>}
     */
    findPokemonById: async (id) => {
        const data = await pokemonDAO.collection.findOne(
            {id: id},
            {projection: {_id: 0}}
        )
        return data ? new Pokemon(data) : null
    },

    /**
     * @param searchTerm {string}
     * @param generation {number}
     * @param limit {number}
     * @param offset {number}
     * @returns {Promise<Pokemon[]>}
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
     * @param moveId {number}
     * @returns {Promise<Pokemon[]>}
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