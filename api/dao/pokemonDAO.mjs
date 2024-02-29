"use strict"

import {MongoClient} from "mongodb";
import Pokemon from "../model/Pokemon.mjs";

const dbUrl = 'mongodb://localhost:27017'

const pokemonDAO = {
    /**
     * @param nameOrId {string | number}
     * @returns {Pokemon | null}
     */
    findPokemonById: async (nameOrId) => {
        const client = new MongoClient(dbUrl)
        const db = client.db("s4b14")
        const pokemonCollection = db.collection('pokemon')
        const id = Number.parseInt(nameOrId)
        const data = await pokemonCollection.findOne(
            Number.isInteger(id) ? {id: id} : {nom: nameOrId},
            {projection: {_id: 0}}
        )
        return data ? new Pokemon(data) : null
    }
}

export default pokemonDAO