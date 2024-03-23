"use strict"

import {MongoClient} from "mongodb";
import Capacite from "../model/Capacite.mjs";
import pokemonDAO from "./pokemonDAO.mjs";

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017'

const capaciteDAO = {
    get collection() {
        const client = new MongoClient(dbUrl)
        const db = client.db('pokemanager')
        return db.collection('capacite')
    },


    /**
     * @param nameOrId {string | number}
     * @returns {Promise<Capacite | null>}
     */
    findMoveByNameOrId: async (nameOrId) => {
        const id = Number.parseInt(nameOrId)
        const data = await capaciteDAO.collection.findOne(
            Number.isInteger(id) ? {id: id} : {nom: nameOrId},
            {projection: {_id: 0}}
        )
        return data ? new Capacite(data) : null
    },

    /**
     * @param type {string}
     * @returns {Promise<Capacite[]>}
     */
    findMovesByType: async (type) => {
        const data = await capaciteDAO.collection.findOne(
            {"types.type.name": type},
            {projection: {_id: 0}}
        )
        return (await data.toArray()).map(e => new Capacite(e))
    },

    /**
     * @param nameOrId {string | number}
     * @returns {Promise<Capacite[]>}
     */
    findPokemonMovesByNamOrId: async (nameOrId) => {
        let pokemon = pokemonDAO.findPokemonByNameOrId(nameOrId)
    }
}

export default capaciteDAO