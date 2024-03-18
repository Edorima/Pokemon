"use strict"

import {MongoClient} from "mongodb"
import Pokemon from "../model/Pokemon.mjs"
import Item from "../model/Item.mjs";

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017'

const itemDAO = {
    get collection() {
        const client = new MongoClient(dbUrl)
        const db = client.db("pokemanager")
        return db.collection('items')
    },

    /**
     * @param limit {number}
     * @param offset {number}
     @returns {Promise<Item[]>}
     */
    getItems: async (limit, offset) => {
        const data = await itemDAO.collection.find(
            {},
            {projection: {_id: 0}, limit: limit || 0, skip: offset || 0}
        )
        return (await data.toArray()).map(e => new Item(e))
    },

    /**
     * @param name {string}
     * @returns {Promise<Item | null>}
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
        const data = await itemDAO.collection.findOne(
            filter,
            {projection: {_id: 0}}
        )
        return data ? new Item(data) : null
    },

    /**
     * @param categorie {string}
     * @param limit {number}
     * @param offset {number}
     * @returns {Promise<Item[]>}
     */
    findItemByCategorie: async (categorie, limit, offset) => {
        const data = itemDAO.collection.find({
            generation: categorie || 0
        }, {projection: {_id: 0, limit: limit || 0, offset: offset || 0}})
        return (await data.toArray()).map(e => new Item(e))
    }
}

export default itemDAO