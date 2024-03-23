"use strict"

import {MongoClient} from "mongodb"
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
     * @param categorie {number}
     * @param limit {number}
     * @param offset {number}
     @returns {Promise<Objet[]>}
     */
    getItems: async (categorie, limit, offset) => {
        const data = await objetDAO.collection.find(
            Number.isInteger(categorie) ? {"categorie.id": categorie} : {},
            {projection: {_id: 0}, limit: limit || LIMIT, skip: offset || 0}
        )
        return (await data.toArray()).map(e => new Objet(e))
    },

    /**
     * @param searchTerm {string}
     * @param categorie {number}
     * @param limit {number}
     * @param offset {number}
     * @returns {Promise<Objet[]>}
     */
    findItemsThatStartsWith: async (searchTerm, categorie, limit, offset) => {
        const filter = {nomNormalise: new RegExp('^' + normalizeString(searchTerm))}
        if (Number.isInteger(categorie))
            filter['categorie.id'] = categorie

        const data = await objetDAO.collection.find(
            filter,
            {projection: {_id: 0},
                limit: limit || LIMIT,
                skip: offset || 0,
                sort: {nomNormalise: 1}}
        )
        return (await data.toArray()).map(e => new Objet(e))
    },

    /**
     * @param name {string}
     * @returns {Promise<Objet | null>}
     */
    findItemByName: async (name) => {
        const id = parseInt(name)
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