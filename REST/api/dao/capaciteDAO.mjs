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

    /**
     * @param type {string | undefined}}
     * @param categorie {string | undefined}
     * @param limit {number}
     * @param offset {number}
     * @returns {Promise<Capacite[]>}
     */
    getMoves: async (type, categorie,  limit, offset) => {
        const filter = {
            ...(type ? { "type": type } : {}),
            ...(categorie ? { "categorie": categorie } : {})
        }
        const data = await capaciteDAO.collection.find(
            filter,
            {projection: {_id: 0}, limit: limit || LIMIT, skip: offset || 0}
        )
        return (await data.toArray()).map(e => new Capacite(e))
    },

    /**
     * @param searchTerm {string}
     * @param type {string | undefined}
     * @param categorie {string | undefined}
     * @param limit {number}
     * @param offset {number}
     * @returns {Promise<Capacite[]>}
     */
    findMovesThatStartsWith: async (searchTerm, type, categorie, limit, offset) => {
        const filter = {nomNormalise: new RegExp('^' + normalizeString(searchTerm))}
        if (type)
            filter.type = type
        if (categorie)
            filter.categorie = categorie

        const data = await capaciteDAO.collection.find(
            filter,
            {projection: {_id: 0},
                limit: limit || LIMIT,
                skip: offset || 0,
                sort: {nomNormalise: 1}}
        )
        return (await data.toArray()).map(e => new Capacite(e))
    }
}

export default capaciteDAO