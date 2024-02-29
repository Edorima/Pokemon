"use strict"

import {MongoClient} from "mongodb";
import Pokemon from "../model/Pokemon.mjs";

const dbUrl = 'mongodb://localhost:27017'

const pokemonDAO = {
    /**
     *
     * @param limit {number}
     * @param offset {number}
     * @returns {Promise<Pokemon[]>}
     */
    getPokemons: async (limit, offset) => {

    },

    /**
     * @param nameOrId {string | number}
     * @returns {Pokemon | null}
     */
    findPokemonByNameOrId: async (nameOrId) => {
        const client = new MongoClient(dbUrl)
        const db = client.db("s4b14")
        const pkmCollection = db.collection('pokemon')
        const id = Number.parseInt(nameOrId)
        const data = await pkmCollection.findOne(
            Number.isInteger(id) ? {id: id} : {nom: nameOrId},
            {projection: {_id: 0}}
        )
        return data ? new Pokemon(data) : null
    },

    /**
     * @param type {string}
     * @param limit {number}
     * @param offset {number}
     * @returns {Promise<Pokemon[]>}
     */
    findPokemonsByType: async (type, limit, offset) => {
        if (offset <= -1) return []

        const client = new MongoClient(dbUrl)
        const db = client.db("s4b14")
        const pkmCollection = db.collection('pokemon')
        const data = await pkmCollection.find(
            {"types.type.name": type},
            {projection: {_id: 0}, skip: offset || 0, limit: limit === 0 ? 1 : limit || 20}
        )
        return (await data.toArray()).map(e => new Pokemon(e))
    },

    /**
     * @param type1 {string}
     * @param type2 {string}
     * @param limit {number}
     * @param offset {number}
     * @returns {Promise<Pokemon[]>}
     */
    findPokemonsByDoubleType: async (type1, type2, limit, offset) => {
        if (offset <= -1) return []


        const client = new MongoClient(dbUrl)
        const db = client.db("s4b14")
        const pkmCollection = db.collection('pokemon')
        const data = pkmCollection.find({
            $or: [
                {$and: [
                    {types: { $elemMatch: { slot: 1, "type.name": type1}}},
                    {types: { $elemMatch: { slot: 2, "type.name": type2}}}
                ]},
                {$and: [
                    {types: { $elemMatch: { slot: 1, "type.name": type2}}},
                    {types: { $elemMatch: { slot: 2, "type.name": type1}}}
                ]}
        ]}, {projection: {_id: 0}, skip: offset || 0, limit: limit === 0 ? 1 : limit || 20})

        return (await data.toArray()).map(e => new Pokemon(e))
    }
}

export default pokemonDAO