"use strict"

import {MongoClient} from "mongodb";
import Capacite from "../model/Capacite.mjs";
import pokemonDAO from "./pokemonDAO.mjs";
import Objet from "../model/Objet.mjs";

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017'
const LIMIT = 20
function normalizeString(str) {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
}


const capaciteDAO = {
    get collection() {
        const client = new MongoClient(dbUrl)
        const db = client.db('pokemanager')
        return db.collection('capacite')
    },

    getMoves: async (categorie, limit, offset) => {
        const data = await capaciteDAO.collection.find(
            Number.isInteger(categorie) ? {"categorie.id": categorie} : {},
            {projection: {_id: 0}, limit: limit || LIMIT, skip: offset || 0}
        )
        return (await data.toArray()).map(e => new Capacite(e))
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

    findMovesThatStartsWith: async (searchTerm, categorie, limit, offset) => {
        const filter = {nomNormalise: new RegExp('^' + normalizeString(searchTerm))}
        /*if (Number.isInteger(categorie))
            filter['categorie.id'] = categorie
*/
        const data = await capaciteDAO.collection.find(
            filter,
            {projection: {_id: 0},
                limit: limit || LIMIT,
                skip: offset || 0,
                sort: {nomNormalise: 1}}
        )
        return (await data.toArray()).map(e => new Capacite(e))
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