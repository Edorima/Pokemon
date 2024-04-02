"use strict"

import CapaciteModel from "./CapaciteModel.mjs"
import Capacite from "../model/Capacite.mjs"

function normalizeString(str) {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
}

const capaciteDAO = {
    LIMIT: 20,

    /**
     * @param moves {Capacite[]}
     * @return {Promise<void>}
     */
    insertAll: async (moves) => {
        await CapaciteModel.insertMany(moves, null)
    },

    /**
     * Récupère les capacités filtrées par type et catégorie avec pagination.
     * @param type {string | undefined} - Filtre les capacités par type.
     * @param categorie {string | undefined} - Filtre les capacités par catégorie.
     * @param limit {number} - Limite le nombre de résultats retournés.
     * @param offset {number} - Définit le point de départ des résultats.
     * @returns {Promise<Capacite[]>} - Une promesse qui résout en un tableau de capacités.
     */
    getMoves: async (
        type = undefined,
        categorie = undefined,
        limit = capaciteDAO.LIMIT,
        offset = 0
    ) => {
        const query = {}
        if (type)
            query.type = type
        if (categorie)
            query.categorie = categorie

        const moves = await CapaciteModel.find(query, null, null)
            .limit(limit || capaciteDAO.LIMIT)
            .skip(offset || 0)
            .exec()

        return moves.map(move => new Capacite(move))
    },

    /**
     * Trouve une capacité spécifique par son identifiant.
     * @param id {number} - L'identifiant de la capacité à trouver.
     * @returns {Promise<Capacite | null>} - Une promesse qui résout en une capacité ou null si non trouvée.
     */
    findMoveById: async (id) => {
        if (!Number.isInteger(id))
            return null

        const move = await CapaciteModel.findOne({id: id}, null, null)
        return move ? new Capacite(move) : null
    },

    /**
     * Recherche les capacités dont le nom commence par un terme de recherche, optionnellement filtré par type et catégorie, avec pagination.
     * @param searchTerm {string} - Le terme de recherche pour le début du nom de la capacité.
     * @param type {string | undefined} - Filtre optionnel par type de capacité.
     * @param categorie {string | undefined} - Filtre optionnel par catégorie de capacité.
     * @param limit {number} - Limite le nombre de résultats.
     * @param offset {number} - Définit le point de départ pour les résultats.
     * @returns {Promise<Capacite[]>} - Une promesse qui résout en un tableau de capacités correspondantes.
     */
    findMovesThatStartsWith: async (
        searchTerm,
        type = undefined,
        categorie = undefined,
        limit = capaciteDAO.LIMIT,
        offset = 0
    ) => {
        const query = {nomNormalise: new RegExp('^' + normalizeString(searchTerm))}
        if (type)
            query.type = type
        if (categorie)
            query.categorie = categorie

        const moves = await CapaciteModel.find(query, null, null)
            .limit(limit || capaciteDAO.LIMIT)
            .skip(offset || 0)
            .sort({nomNormalise: 1})
            .exec()

        return moves.map(move => new Capacite(move))
    },

    /**
     * Trouve toutes les capacités qu'un Pokémon spécifique peut apprendre.
     * @param pkm {Pokemon} - Le Pokémon pour lequel chercher les capacités.
     * @returns {Promise<Capacite[]>} - Une promesse qui résout en un tableau de capacités que le Pokémon peut apprendre.
     */
    findMovesByPokemon: async (pkm) => {
        const moves = await CapaciteModel.find(
            {id: {$in: pkm.capacites}},
            null,
            null
        ).exec()

        return moves.map(move => new Capacite(move))
    }
}

export default capaciteDAO