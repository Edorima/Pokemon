"use strict"

import {MongoClient} from "mongodb"
import Objet from "../model/Objet.mjs"

const dbUrl = 'mongodb://localhost:27017'
const LIMIT = 20

function normalizeString(str) {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
}

const objetDAO = {
    /**
     * Accède à la collection 'objet' dans MongoDB.
     */
    get collection() {
        const client = new MongoClient(dbUrl)
        const db = client.db("pokemanager")
        return db.collection('objet')
    },

    /**
     * Récupère les objets filtrés par catégorie avec pagination.
     * @param categorie {number} - L'ID de la catégorie pour filtrer les objets.
     * @param limit {number} - Limite le nombre de résultats retournés.
     * @param offset {number} - Définit le point de départ des résultats.
     * @returns {Promise<Objet[]>} - Une promesse résolvant un tableau d'objets.
     */
    getItems: async (categorie, limit, offset) => {
        const data = await objetDAO.collection.find(
            Number.isInteger(categorie) ? {"categorie.id": categorie} : {},
            {projection: {_id: 0}, limit: limit || LIMIT, skip: offset || 0}
        )
        return (await data.toArray()).map(e => new Objet(e))
    },

    /**
     * Trouve des objets dont le nom normalisé commence par un terme de recherche spécifié, optionnellement filtré par catégorie, avec pagination.
     * @param searchTerm {string} - Le terme de recherche pour le début du nom de l'objet.
     * @param categorie {number} - L'ID de la catégorie pour filtrer les objets.
     * @param limit {number} - Limite le nombre de résultats.
     * @param offset {number} - Définit le point de départ pour les résultats.
     * @returns {Promise<Objet[]>} - Une promesse résolvant un tableau d'objets correspondants.
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
    }
}

export default objetDAO