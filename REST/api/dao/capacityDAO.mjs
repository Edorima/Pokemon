"use strict"

import {MongoClient} from "mongodb";
import Capacite from "../model/Capacite.mjs";
import Pokemon from "../model/Pokemon.mjs";
import pokemonDAO from "./pokemonDAO.mjs";

const dbUrl = 'mongodb://localhost:27017'

const capacityDAO = {

    /**
     * @param nameOrId {string | number}
     * @returns {Promise<Capacite | null>}
     */
    findMoveByNameOrId: async (nameOrId) => {
        const client = new MongoClient(dbUrl)
        const db = client.db("s4b14")
        const cpctCollection = db.collection('capacite')
        const id = Number.parseInt(nameOrId)
        const data = await cpctCollection.findOne(
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
        const client = new MongoClient(dbUrl)
        const db = client.db("s4b14")
        const cpCollection = db.collection('capacite')


        const data = await cpCollection.findOne(
            {"types.type.name": type},
            {projection: {_id: 0}}
        )
        return (await data.toArray()).map(e => new Capacite(e))
    },

    /**
     *
     * @param nameOrId {string | number}
     * @returns {Promise<Capacite[]>}
     */
    findPokemonMovesByNamOrId: async (nameOrId) => {
        let pokemon = pokemonDAO.findPokemonByNameOrId(nameOrId)
    }
}

export default capacityDAO