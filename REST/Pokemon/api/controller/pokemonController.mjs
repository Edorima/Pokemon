"use strict"

import pokemonDAO from "../dao/pokemonDAO.mjs"

const pokemonController = {
    getPokemons: async (generation, type1, type2, limit, offset) =>
        await pokemonDAO.getPokemons(generation, type1, type2, limit, offset),

    findPokemonById: async (pkmId) =>
        await pokemonDAO.findPokemonById(pkmId),

    findPokemonsThatStartsWith: async (searchTerm, generation, type1, type2, limit, offset) =>
        await pokemonDAO.findPokemonsThatStartsWith(searchTerm, generation, type1, type2, limit, offset),

    findPokemonsByMove: async (moveId) => {
        const url = `http://localhost:8082/capacite/${moveId}`
        const response = await fetch(url, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        })

        if (!response.ok)
            throw 'Move Not Found'

        const move = await response.json()
        return await pokemonDAO.findPokemonsByMove(move)
    }
}

export default pokemonController