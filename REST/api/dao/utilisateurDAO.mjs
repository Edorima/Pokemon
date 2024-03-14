"use strict"

import {MongoClient} from "mongodb";
import Utilisateur from "../model/Utilisateur.mjs";
import bcrypt from 'bcrypt'

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017'

const utilisateurDAO = {
    get collection() {
        const client = new MongoClient(dbUrl)
        const db = client.db('pokemanager')
        return db.collection('utilisateur')
    },

    /**
     * Renvoie un utilisateur.
     * @param pseudo {string}
     * @returns {Promise<Utilisateur | null>}
     */
    getUser: async (pseudo) => {
        const data = await utilisateurDAO.collection.findOne({pseudo: pseudo})
        return data ? new Utilisateur(data) : null
    },

    /**
     * Si l'utilisateur existe, renvoie false. Sinon l'ajoute et renvoie true.
     * @param pseudo {string}
     * @param motDePasse {string}
     * @returns {Promise<boolean>}
     */
    addUser: async (pseudo, motDePasse) => {
        const utilisateur = utilisateurDAO.collection
        const result = await utilisateur.findOne(
            {pseudo: pseudo}
        )
        if (result) return false
        const mdpCrypte = await bcrypt.hash(motDePasse, 10)
        await utilisateur.insertOne(new Utilisateur({pseudo: pseudo, motDePasse: mdpCrypte}))
        return true
    }
}

export default utilisateurDAO