"use strict"

import capaciteDAO from "../dao/capaciteDAO.mjs"

const capaciteController = {
    getMoves: async (type, categorie,  limit, offset) =>
        await capaciteDAO.getMoves(type, categorie,  limit, offset),

    findMoveById: async (id) =>
        await capaciteDAO.findMoveById(id),

    findMovesThatStartsWith: async (searchTerm, type, categorie, limit, offset) =>
        await capaciteDAO.findMovesThatStartsWith(searchTerm, type, categorie, limit, offset),

    findMovesByPokemon: async (pkmId) => {
        const url = `http://localhost:8081/pokemon/${pkmId}`
        const response = await fetch(url, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        })

        if (!response.ok) return null

        const pokemon = await response.json()
        return await capaciteDAO.findMovesByPokemon(pokemon)
    }
}

export default capaciteController