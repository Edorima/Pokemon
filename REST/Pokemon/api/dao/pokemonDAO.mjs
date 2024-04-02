"use strict"

import PokemonModel from "./PokemonModel.mjs"
import Pokemon from "../model/Pokemon.mjs"

function normalizeString(str) {
    return str
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
}

const pokemonDAO = {
    LIMIT: 20,

    /**
     * @param pokemons {Pokemon[]}
     * @return {Promise<void>}
     */
    insertAll: async (pokemons) => {
        await PokemonModel.insertMany(pokemons, null)
    },

    /**
     * Récupère les Pokémon filtrés par génération avec pagination.
     * @param generation {number | undefined} - La génération des Pokémon à filtrer.
     * @param type1 {string | undefined} - Le type principal des Pokémon à filtrer. Si non spécifié, tous les types sont considérés.
     * @param type2 {string | undefined} - Le type secondaire des Pokémon à filtrer. Si non spécifié, tous les types secondaires sont considérés.
     * @param limit {number} - Limite le nombre de résultats retournés.
     * @param offset {number} - Définit le point de départ des résultats.
     * @returns {Promise<Pokemon[]>} - Une promesse qui résout en un tableau de Pokémon.
     */
    getPokemons: async (
        generation = undefined,
        type1 = undefined,
        type2 = undefined,
        limit = pokemonDAO.LIMIT,
        offset = 0
    ) => {
        const query = {}
        if (Number.isInteger(generation))
            query.generation = generation

        if (type1) {
            query.types = {$all: [type1]}
            if (type2)
                query.types.$all.push(type2)
        }

        const pokemons = await PokemonModel.find(query, null, null)
            .limit(limit || pokemonDAO.LIMIT)
            .skip(offset || 0)
            .exec()

        return pokemons.map(pkm => new Pokemon(pkm))
    },

    /**
     * Trouve un Pokémon spécifique par son identifiant.
     * @param id {number} - L'identifiant du Pokémon à trouver.
     * @returns {Promise<Pokemon | null>} - Une promesse qui résout en un Pokémon trouvé ou null.
     */
    findPokemonById: async (id) => {
        if (!Number.isInteger(id))
            return null

        const pkm = await PokemonModel.findOne({id: id}, null, null)
        return pkm ? new Pokemon(pkm) : null
    },

    /**
     * Trouve des Pokémon dont le nom normalisé commence par un terme de recherche spécifié,
     * optionnellement filtré par génération et par type(s).
     * @param searchTerm {string} - Le terme de recherche pour le début du nom du Pokémon.
     * @param generation {number | undefined} - La génération des Pokémon à filtrer.
     * @param type1 {string | undefined} - Le type principal des Pokémon à filtrer.
     * Si non spécifié, tous les types sont considérés.
     * @param type2 {string | undefined} - Le type secondaire des Pokémon à filtrer.
     * Si non spécifié, tous les types secondaires sont considérés.
     * @param limit {number} - Limite le nombre de résultats.
     * @param offset {number} - Définit le point de départ pour les résultats.
     * @returns {Promise<Pokemon[]>} - Une promesse qui résout en un tableau de Pokémon correspondants.
     */
    findPokemonsThatStartsWith: async (
        searchTerm,
        generation = undefined,
        type1 = undefined,
        type2 = undefined,
        limit = pokemonDAO.LIMIT,
        offset = 0
    ) => {
        const query = {nomNormalise: new RegExp('^' + normalizeString(searchTerm))}
        if (Number.isInteger(generation))
            query.generation = generation

        if (type1) {
            query.types = {$all: [type1]}
            if (type2)
                query.types.$all.push(type2)
        }

        const pokemons = await PokemonModel.find(query, null, null)
            .limit(limit || pokemonDAO.LIMIT)
            .skip(offset || 0)
            .sort({id: 1})
            .exec()

        return pokemons.map(pkm => new Pokemon(pkm))
    },

    /**
     * Trouve des Pokémon capables d'apprendre une capacité spécifique par l'ID de la capacité.
     * @param move {Capacite} - La capacité pour filtrer les Pokémon qui peuvent l'apprendre.
     * @returns {Promise<Pokemon[]>} - Une promesse qui résout en un tableau de Pokémon pouvant apprendre la capacité spécifiée.
     */
    findPokemonsByMove: async (move) => {
        const pokemons = await PokemonModel.find(
            {nomAnglais: {$in: move.pokemons}},
            null,
            null
        ).exec()

        return pokemons.map(pkm => new Pokemon(pkm))
    }
}

export default pokemonDAO