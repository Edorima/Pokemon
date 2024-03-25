"use strict"

import {MongoClient} from "mongodb"
import Pokemon from "../model/Pokemon.mjs"

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
     * @param nameOrId {string | number}
     * @returns {Promise<Pokemon | null>}
     */
    findPokemonByNameOrId: async (nameOrId) => {
        const id = parseInt(nameOrId)
        const data = await pokemonDAO.collection.findOne(
            Number.isInteger(id) ?
                {id: id} :
                {nomNormalise: normalizeString(nameOrId)},
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
     * @param type {string}
     * @param limit {number}
     * @param offset {number}
     @returns {Promise<Pokemon[]>}
     */
    findPokemonsByType: async (type, limit, offset) => {
        if (offset <= -1) return []

        const data = await pokemonDAO.collection.find(
            {"types.type": type},
            {projection: {_id: 0}, limit: limit || LIMIT, skip: offset || 0}
        )
        return (await data.toArray()).map(e => new Pokemon(e))
    },

    /**
     * @param type1 {string}
     * @param type2 {string}
     * @param limit {number}
     * @param offset {number}
     @returns {Promise<Pokemon[]>}
     */
    findPokemonsByDoubleType: async (type1, type2, limit, offset) => {
        if (offset <= -1) return []

        const data = pokemonDAO.collection.find({
            $or: [
                {$and: [
                    {types: { $elemMatch: { slot: 1, "type": type1}}},
                    {types: { $elemMatch: { slot: 2, "type": type2}}}
                ]},
                {$and: [
                    {types: { $elemMatch: { slot: 1, "type": type2}}},
                    {types: { $elemMatch: { slot: 2, "type": type1}}}
                ]}
        ]}, {projection: {_id: 0}, limit: limit || LIMIT, skip: offset || 0})

        return (await data.toArray()).map(e => new Pokemon(e))
    }
}

export default pokemonDAO