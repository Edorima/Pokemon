"use strict"

import pokemonDAO from "../dao/pokemonDAO.mjs";

const pokemonController = {
    getPokemons: async (generation, type1, type2, limit, offset) =>
        await pokemonDAO.getPokemons(generation, type1, type2, limit, offset),

    findPokemonById: async (pkmId) =>
        await pokemonDAO.findPokemonById(pkmId),

    findPokemonsThatStartsWith: async (searchTerm, generation, type1, type2, limit, offset) =>
        await pokemonDAO.findPokemonsThatStartsWith(searchTerm, generation, type1, type2, limit, offset),

    findPokemonsByMove: async (moveId) => {

    }
}

export default pokemonController