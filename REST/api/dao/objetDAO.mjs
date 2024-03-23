"use strict"

import {MongoClient} from "mongodb"
import Pokemon from "../model/Pokemon.mjs"
import Objet from "../model/Objet.mjs";

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017'
const LIMIT = 20

function normalizeString(str) {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
}

const objetDAO = {
    get collection() {
        const client = new MongoClient(dbUrl)
        const db = client.db("pokemanager")
        return db.collection('objet')
    },

    /**
     * @param limit {number}
     * @param offset {number}
     @returns {Promise<Objet[]>}
     */
    getItems: async (limit, offset) => {
        const data = await objetDAO.collection.find(
            {},
            {projection: {_id: 0}, limit: limit || LIMIT, skip: offset || 0}
        )
        return (await data.toArray()).map(e => new Objet(e))
    },

    /**
     * @param searchTerm {string}
     * @param limit {number}
     * @param offset {number}
     * @returns {Promise<Pokemon[]>}
     */
    findItemsThatStartsWith: async (searchTerm, limit, offset) => {
        const data = await objetDAO.collection.find(
            {nomNormalise: new RegExp('^' + normalizeString(searchTerm))},
            {projection: {_id: 0}, limit: limit || LIMIT, skip: offset || 0, sort: {id: 1}}
        )
        return (await data.toArray()).map(e => new Pokemon(e))
    },

    /**
     * @param name {string}
     * @returns {Promise<Objet | null>}
     */
    findItemByName: async (name) => {
        const id = Number.parseInt(name)
        let filter
        if (Number.isInteger(id)) {
            filter = {id: id}
        } else {
            const firstLetter = name.charAt(0).toUpperCase()
            filter = {nom: firstLetter + name.slice(1)}
        }
        const data = await objetDAO.collection.findOne(
            filter,
            {projection: {_id: 0}}
        )
        return data ? new Objet(data) : null
    }
}

export default objetDAO