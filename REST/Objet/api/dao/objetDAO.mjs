"use strict"

import ObjetModel from "./ObjetModel.mjs"
import Objet from "../model/Objet.mjs"

function normalizeString(str) {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
}

const objetDAO = {
    LIMIT: 20,

    /**
     * @param items {Objet[]}
     * @return {Promise<void>}
     */
    insertAll: async (items) => {
        await ObjetModel.insertMany(items, null)
    },

    /**
     * Récupère les objets filtrés par catégorie avec pagination.
     * @param categorie {number | undefined} - L'ID de la catégorie pour filtrer les objets.
     * @param limit {number | undefined} - Limite le nombre de résultats retournés.
     * @param offset {number} - Définit le point de départ des résultats.
     * @returns {Promise<Objet[]>} - Une promesse résolvant un tableau d'objets.
     */
    getItems: async (
        categorie = undefined,
        limit = objetDAO.LIMIT,
        offset = 0
    ) => {
        const query = {}

        if (Number.isInteger(categorie))
            query['categorie.id'] = categorie

        const items = await ObjetModel.find(query, null, null)
            .limit(limit || objetDAO.LIMIT)
            .skip(offset || 0)
            .exec()

        return items.map(item => new Objet(item))
    },

    /**
     * Trouve des objets dont le nom normalisé commence par un terme de recherche spécifié, optionnellement filtré par catégorie, avec pagination.
     * @param searchTerm {string} - Le terme de recherche pour le début du nom de l'objet.
     * @param categorie {number | undefined} - L'ID de la catégorie pour filtrer les objets.
     * @param limit {number} - Limite le nombre de résultats.
     * @param offset {number} - Définit le point de départ pour les résultats.
     * @returns {Promise<Objet[]>} - Une promesse résolvant un tableau d'objets correspondants.
     */
    findItemsThatStartsWith: async (
        searchTerm,
        categorie = undefined,
        limit = objetDAO.LIMIT,
        offset = 0
    ) => {
        const query = {nomNormalise: new RegExp('^' + normalizeString(searchTerm))}

        if (Number.isInteger(categorie))
            query['categorie.id'] = categorie

        const items = await ObjetModel.find(query, null, null)
            .limit(limit || objetDAO.LIMIT)
            .skip(offset || 0)
            .sort({nomNormalise: 1})
            .exec()

        return items.map(item => new Objet(item))
    }
}

export default objetDAO