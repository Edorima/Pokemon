"use strict"

import {expect} from "chai"
import mongoose from "mongoose"
import {MongoMemoryServer} from "mongodb-memory-server"
import pokemonDAO from "../api/dao/pokemonDAO.mjs"
import Pokemon from "../api/model/Pokemon.mjs"
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pokemonsPath = path.join(__dirname, 'pokemons.json')
const rawPokemons = fs.readFileSync(pokemonsPath, 'utf8')
const pokemonsData = JSON.parse(rawPokemons).map(({ _id, ...rest }) => rest)
await mongoose.connection.close()
const mongoServer = await MongoMemoryServer.create()
const uri = mongoServer.getUri()
await mongoose.connect(uri)
await Pokemon.insertMany(pokemonsData, null)

describe("getPokemons should return", () => {
    it("pokemons", async () => {
        const pokemons = await pokemonDAO.getPokemons()
        expect(pokemons).to.be.an('array').that.is.not.empty
        expect(pokemons[0].toObject()).to.include.all.keys([
            'capacites', 'description', 'espece', 'generation',
            'nom', 'nomAnglais', 'nomNormalise', 'poids', 'id',
            'sprites', 'stats', 'taille', 'talents', 'types'
        ])
    })

    it("pokemons of specified generation", async () => {
        const pokemons = await pokemonDAO.getPokemons(1, undefined, undefined, 898)
        expect(pokemons).to.be.an('array').that.is.not.empty
        expect(pokemons).to.satisfy(pokemons =>
            pokemons.every(pokemon => pokemon.generation === 1))
    })

    it("no pokemons with invalid generation", async () => {
        const pokemons = await pokemonDAO.getPokemons(0, undefined, undefined, 898)
        expect(pokemons).to.be.an('array').that.is.empty
    })

    it("pokemons of specified generation and type", async () => {
        const pokemons = await pokemonDAO.getPokemons(1, 'Feu', undefined, 898)
        expect(pokemons).to.be.an('array').that.is.not.empty
        expect(pokemons).to.satisfy(pokemons =>
            pokemons.every(pokemon =>
                pokemon.generation === 1 && pokemon.types.includes('Feu')
        ))
    })

    it("pokemons of specified generation and both type", async () => {
        const pokemons = await pokemonDAO.getPokemons(1, 'Plante', 'Poison', 898)
        expect(pokemons).to.be.an('array').that.is.not.empty
        expect(pokemons).to.satisfy(pokemons =>
            pokemons.every(pokemon =>
                pokemon.generation === 1 &&
                pokemon.types.includes('Plante') &&
                pokemon.types.includes('Poison')
            ))
    })

    it("pokemons of specified type", async () => {
        const pokemons = await pokemonDAO.getPokemons(undefined, 'Feu', undefined, 898)
        expect(pokemons).to.be.an('array').that.is.not.empty
        expect(pokemons).to.satisfy(pokemons =>
            pokemons.every(pokemon => pokemon.types.includes('Feu'))
        )
    })

    it("pokemons of both specified type", async () => {
        const pokemons = await pokemonDAO.getPokemons(
            undefined, 'Plante', 'Poison', 898
        )
        expect(pokemons).to.be.an('array').that.is.not.empty
        expect(pokemons).to.satisfy(pokemons =>
            pokemons.every(pokemon =>
                pokemon.types.includes('Plante') && pokemon.types.includes('Poison')
        ))
    })

    it("pokemons without taking consideration of type2 without type1", async () => {
        const pokemons = await pokemonDAO.getPokemons(undefined, undefined, 'Feu', 898)
        expect(pokemons).to.satisfy(pokemons =>
            pokemons.some(pokemon => !pokemon.types.includes('Feu'))
        )
    })
})

describe('findPokemonById should return', () => {
    it("a pokemon with the specified id", async () => {
        const pokemon = await pokemonDAO.findPokemonById(200)
        expect(pokemon).to.not.be.null
        expect(pokemon.nom).to.equal('Feuforêve')
        expect(pokemon.id).to.equal(200)
    })

    it("null with an invalid pokemon id", async () => {
        const pokemon = await pokemonDAO.findPokemonById(0)
        expect(pokemon).to.be.null
    })
})

describe('findPokemonsThatStartsWith should return', () => {
    it("pokemons whose names start with the specified term", async () => {
        // Utilisation des 3 caractères du nom du premier Pokémon
        const searchTerm = pokemonsData[0].nom.slice(0, 3)
        const pokemons = await pokemonDAO.findPokemonsThatStartsWith(searchTerm)
        expect(pokemons).to.be.an('array').with.lengthOf.at.least(1)
        expect(pokemons[0].nom).to.include(searchTerm)
    })
})

describe('findPokemonsByMove should return', () => {
    it("pokemons that can learn a specified move", async () => {
        // Coupe-Vent est la capacité ayant pour id 13
        const pkmApprenantCoupeVent = pokemonsData.filter(
            p => p.capacites.includes(13)
        ).map(p => p.nomAnglais) // On récupère les noms anglais qui ont cette capacité.

        /* findPokemonsByMove se sert de la colonne 'pokemons' d'une capacité pour
         mapper les Pokémon qui peuvent apprendre cette attaque. */
        const pokemons = await pokemonDAO.findPokemonsByMove({pokemons: pkmApprenantCoupeVent})
        expect(pokemons).to.satisfy(pokemons =>
            pokemons.every(pokemon => pokemon.capacites.includes(13))
        )
    })
})