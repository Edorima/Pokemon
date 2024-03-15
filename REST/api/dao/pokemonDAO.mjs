"use strict"

import {MongoClient} from "mongodb"
import Pokemon from "../model/Pokemon.mjs"

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017'

const pokemonDAO = {
    get collection() {
        const client = new MongoClient(dbUrl)
        const db = client.db("pokemanager")
        return db.collection('pokemon')
    },

    /**
     * @param limit {number}
     * @param offset {number}
     @returns {Promise<Pokemon[]>}
     */
    getPokemons: async (limit, offset) => {
        const data = await pokemonDAO.collection.find(
            {},
            {projection: {_id: 0}, limit: limit === 0 ? 1 : limit || 20, skip: offset || 0}
        )
        return (await data.toArray()).map(e => new Pokemon(e))
    },

    /**
     * @param nameOrId {string | number}
     * @returns {Promise<Pokemon | null>}
     */
    findPokemonByNameOrId: async (nameOrId) => {
        const id = Number.parseInt(nameOrId)
        let filter
        if (Number.isInteger(id)) {
            filter = {id: id}
        } else {
            const firstLetter = nameOrId.charAt(0).toUpperCase()
            filter = {nom: firstLetter + nameOrId.slice(1)}
        }
        const data = await pokemonDAO.collection.findOne(
            filter,
            {projection: {_id: 0}}
        )
        return data ? new Pokemon(data) : null
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
            {"types.type.name": type},
            {projection: {_id: 0}, limit: limit === 0 ? 1 : limit || 20, skip: offset || 0}
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
                    {types: { $elemMatch: { slot: 1, "type.name": type1}}},
                    {types: { $elemMatch: { slot: 2, "type.name": type2}}}
                ]},
                {$and: [
                    {types: { $elemMatch: { slot: 1, "type.name": type2}}},
                    {types: { $elemMatch: { slot: 2, "type.name": type1}}}
                ]}
        ]}, {projection: {_id: 0}, limit: limit === 0 ? 1 : limit || 20, skip: offset || 0})

        return (await data.toArray()).map(e => new Pokemon(e))
    }
}

export default pokemonDAO