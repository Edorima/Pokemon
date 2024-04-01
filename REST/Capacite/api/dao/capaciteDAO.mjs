"use strict"

import Capacite from "../model/Capacite.mjs"

const LIMIT = 20

function normalizeString(str) {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
}

const capaciteDAO = {
    /**
     * Récupère les capacités filtrées par type et catégorie avec pagination.
     * @param type {string | undefined} - Filtre les capacités par type.
     * @param categorie {string | undefined} - Filtre les capacités par catégorie.
     * @param limit {number} - Limite le nombre de résultats retournés.
     * @param offset {number} - Définit le point de départ des résultats.
     * @returns {Promise<Object[]>} - Une promesse qui résout en un tableau de capacités.
     */
    getMoves: async (type, categorie,  limit, offset) => {
        const query = {}
        if (type)
            query.type = type
        if (categorie)
            query.categorie = categorie

        return Capacite.find(query, {_id: 0}, null)
            .limit(limit || LIMIT)
            .skip(offset || 0)
            .exec()
    },

    /**
     * Trouve une capacité spécifique par son identifiant.
     * @param id {number} - L'identifiant de la capacité à trouver.
     * @returns {Promise<Object | null>} - Une promesse qui résout en une capacité ou null si non trouvée.
     */
    findMoveById: async (id) => {
        if (!Number.isInteger(id))
            return null

        return Capacite.findOne(
            {id: id},
            {_id: 0},
            null
        )
    },

    /**
     * Recherche les capacités dont le nom commence par un terme de recherche, optionnellement filtré par type et catégorie, avec pagination.
     * @param searchTerm {string} - Le terme de recherche pour le début du nom de la capacité.
     * @param type {string | undefined} - Filtre optionnel par type de capacité.
     * @param categorie {string | undefined} - Filtre optionnel par catégorie de capacité.
     * @param limit {number} - Limite le nombre de résultats.
     * @param offset {number} - Définit le point de départ pour les résultats.
     * @returns {Promise<Object[]>} - Une promesse qui résout en un tableau de capacités correspondantes.
     */
    findMovesThatStartsWith: async (searchTerm, type, categorie, limit, offset) => {
        const query = {nomNormalise: new RegExp('^' + normalizeString(searchTerm))}
        if (type)
            query.type = type
        if (categorie)
            query.categorie = categorie

        return Capacite.find(query, {_id: 0}, null)
            .limit(limit || LIMIT)
            .skip(offset || 0)
            .sort({nomNormalise: 1})
            .exec()
    },

    /**
     * Trouve toutes les capacités qu'un Pokémon spécifique peut apprendre.
     * @param pkm {Object} - Le Pokémon pour lequel chercher les capacités.
     * @returns {Promise<Object[]>} - Une promesse qui résout en un tableau de capacités que le Pokémon peut apprendre.
     */
    findMovesByPokemon: async (pkm) => {
        return Capacite.find(
            {id: {$in: pkm.capacites}},
            {_id: 0},
            null
        )
    }
}

export default capaciteDAO