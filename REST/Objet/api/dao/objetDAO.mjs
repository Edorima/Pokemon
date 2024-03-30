"use strict"

import Objet from "../model/Objet.mjs"

const LIMIT = 20

function normalizeString(str) {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
}

const objetDAO = {
    /**
     * Récupère les objets filtrés par catégorie avec pagination.
     * @param categorie {number} - L'ID de la catégorie pour filtrer les objets.
     * @param limit {number} - Limite le nombre de résultats retournés.
     * @param offset {number} - Définit le point de départ des résultats.
     * @returns {Promise<Object[]>} - Une promesse résolvant un tableau d'objets.
     */
    getItems: async (categorie, limit, offset) => {
        const query = {}

        if (Number.isInteger(categorie))
            query['categorie.id'] = categorie

        return Objet.find(query, {_id: 0}, null)
            .limit(limit || LIMIT)
            .skip(offset || 0)
            .exec()
    },

    /**
     * Trouve des objets dont le nom normalisé commence par un terme de recherche spécifié, optionnellement filtré par catégorie, avec pagination.
     * @param searchTerm {string} - Le terme de recherche pour le début du nom de l'objet.
     * @param categorie {number} - L'ID de la catégorie pour filtrer les objets.
     * @param limit {number} - Limite le nombre de résultats.
     * @param offset {number} - Définit le point de départ pour les résultats.
     * @returns {Promise<Object[]>} - Une promesse résolvant un tableau d'objets correspondants.
     */
    findItemsThatStartsWith: async (searchTerm, categorie, limit, offset) => {
        const query = {nomNormalise: new RegExp('^' + normalizeString(searchTerm))}

        if (Number.isInteger(categorie))
            query['categorie.id'] = categorie

        return Objet.find(query, {_id: 0}, null)
            .limit(limit || LIMIT)
            .skip(offset || 0)
            .sort({nomNormalise: 1})
            .exec()
    }
}

export default objetDAO