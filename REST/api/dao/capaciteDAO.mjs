"use strict"

import {MongoClient} from "mongodb"
import Capacite from "../model/Capacite.mjs"
import pokemonDAO from "./pokemonDAO.mjs"

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017'
const LIMIT = 20
function normalizeString(str) {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
}

const capaciteDAO = {
    /**
     * Accède à la collection 'capacite' dans MongoDB.
     */
    get collection() {
        const client = new MongoClient(dbUrl)
        const db = client.db('pokemanager')
        return db.collection('capacite')
    },

    /**
     * Récupère les capacités filtrées par type et catégorie avec pagination.
     * @param type {string | undefined} - Filtre les capacités par type.
     * @param categorie {string | undefined} - Filtre les capacités par catégorie.
     * @param limit {number} - Limite le nombre de résultats retournés.
     * @param offset {number} - Définit le point de départ des résultats.
     * @returns {Promise<Capacite[]>} - Une promesse qui résout en un tableau de capacités.
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
     * Trouve une capacité spécifique par son identifiant.
     * @param id {number} - L'identifiant de la capacité à trouver.
     * @returns {Promise<Capacite | null>} - Une promesse qui résout en une capacité ou null si non trouvée.
     */
    findMoveById: async (id) => {
        const data = await capaciteDAO.collection.findOne(
        {id: id},
        {projection: {_id: 0}}
        )
        return data ? new Capacite(data) : null
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
    },

    /**
     * Trouve toutes les capacités qu'un Pokémon spécifique peut apprendre.
     * @param pkmId {number} - L'identifiant du Pokémon pour lequel chercher les capacités.
     * @returns {Promise<Capacite[]>} - Une promesse qui résout en un tableau de capacités que le Pokémon peut apprendre.
     */
    findMovesByPokemon: async (pkmId) => {
        const pkm = await pokemonDAO.findPokemonById(pkmId)
        const data = await capaciteDAO.collection.find(
            {id: {$in: pkm.capacites}},
            {projection: {_id: 0}}
        )
        return (await data.toArray()).map(e => new Capacite(e))
    }
}

export default capaciteDAO