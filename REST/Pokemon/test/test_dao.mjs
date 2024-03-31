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

describe("getPokemons", () => {
    it("should return pokemons", async () => {
        const pokemons = await pokemonDAO.getPokemons()
        expect(pokemons).to.be.an('array').that.is.not.empty
        expect(pokemons[0].toObject()).to.include.all.keys([
            'capacites', 'description', 'espece', 'generation',
            'nom', 'nomAnglais', 'nomNormalise', 'poids', 'id',
            'sprites', 'stats', 'taille', 'talents', 'types'
        ])
    })

    it("should return pokemons of generation 1", async () => {
        const pokemons = await pokemonDAO.getPokemons(1)
        expect(pokemons).to.be.an('array').that.is.not.empty
        expect(pokemons).to.satisfy(pokemons =>
            pokemons.every(pokemon => pokemon.generation === 1))
    })

    it("should return pokemons of generation 5", async () => {
        const pokemons = await pokemonDAO.getPokemons(5)
        expect(pokemons).to.be.an('array').that.is.not.empty
        expect(pokemons).to.satisfy(pokemons =>
            pokemons.every(pokemon => pokemon.generation === 5))
    })

    it("should return pokemons of generation 8", async () => {
        const pokemons = await pokemonDAO.getPokemons(8)
        expect(pokemons).to.be.an('array').that.is.not.empty
        expect(pokemons).to.satisfy(pokemons =>
            pokemons.every(pokemon => pokemon.generation === 8))
    })

    it("should return no pokemons with invalid generation", async () => {
        const pokemons = await pokemonDAO.getPokemons(0)
        expect(pokemons).to.be.an('array').that.is.empty
    })

    it("should return pokemons of generation 4 and type Fire", async () => {
        const pokemons = await pokemonDAO.getPokemons(4, 'Feu')
        expect(pokemons).to.be.an('array').that.is.not.empty
        expect(pokemons).to.satisfy(pokemons =>
            pokemons.every(pokemon =>
                pokemon.generation === 4 && pokemon.types.includes('Feu')
            ))
    })

    it("should return pokemons of generation 1 and both type Grass and Poison", async () => {
        const pokemons = await pokemonDAO.getPokemons(1, 'Plante', 'Poison')
        expect(pokemons).to.be.an('array').that.is.not.empty
        expect(pokemons).to.satisfy(pokemons =>
            pokemons.every(pokemon =>
                pokemon.generation === 1 &&
                pokemon.types.includes('Plante') &&
                pokemon.types.includes('Poison')
            ))
    })

    it("should return pokemons of type Fighting", async () => {
        const pokemons = await pokemonDAO.getPokemons(undefined, 'Combat')
        expect(pokemons).to.be.an('array').that.is.not.empty
        expect(pokemons).to.satisfy(pokemons =>
            pokemons.every(pokemon => pokemon.types.includes('Combat'))
        )
    })

    it("should return pokemons of both type Grass and Poison", async () => {
        const pokemons = await pokemonDAO.getPokemons(
            undefined, 'Plante', 'Poison'
        )
        expect(pokemons).to.be.an('array').that.is.not.empty
        expect(pokemons).to.satisfy(pokemons =>
            pokemons.every(pokemon =>
                pokemon.types.includes('Plante') && pokemon.types.includes('Poison')
        ))
    })

    it("should return pokemons without taking consideration of type Fire without type1 defined", async () => {
        const pokemons = await pokemonDAO.getPokemons(undefined, undefined, 'Feu')
        expect(pokemons).to.be.an('array').that.is.not.empty
        expect(pokemons).to.satisfy(pokemons =>
            pokemons.some(pokemon => !pokemon.types.includes('Feu'))
        )
    })

    it("should return a limited number of pokemons when a limit is specified", async () => {
        const limit = 5
        const pokemons = await pokemonDAO.getPokemons(
            undefined, undefined, undefined, limit
        )
        expect(pokemons).to.be.an('array')
        expect(pokemons.length).to.equal(limit)
    })

    it(`should return ${pokemonDAO.LIMIT} pokemons when limit is errored`, async () => {
        const pokemons = await pokemonDAO.getPokemons(
            undefined, undefined, undefined, NaN
        )
        expect(pokemons).to.be.an('array').that.is.not.empty
        expect(pokemons.length).to.equal(pokemonDAO.LIMIT)
    })
})

describe('findPokemonById', () => {
    it("should return a pokemon with the specified id", async () => {
        const pokemon = await pokemonDAO.findPokemonById(200)
        expect(pokemon).to.not.be.null
        expect(pokemon.nom).to.equal('Feuforêve')
        expect(pokemon.id).to.equal(200)
    })

    it("should return null with an invalid pokemon id", async () => {
        const pokemon = await pokemonDAO.findPokemonById(0)
        expect(pokemon).to.be.null
    })
})

describe('findPokemonsThatStartsWith', () => {
    it("should return pokemons whose names start with the specified term", async () => {
        const searchTerm = 'Bulbi'
        const pokemons = await pokemonDAO.findPokemonsThatStartsWith(searchTerm)

        // Vérifie que le tableau n'est pas vide.
        expect(pokemons).to.be.an('array').that.is.lengthOf(1)

        // Vérifie que chaque Pokémon retourné commence bien par le terme de recherche.
        expect(pokemons[0].nom).to.equal('Bulbizarre')
        expect(pokemons[0].id).to.equal(1)
    })

    it("should return an empty array for an unmatched search term", async () => {
        const searchTerm = 'Zyx' // Un terme qui ne correspond à aucun nom de Pokémon.
        const pokemons = await pokemonDAO.findPokemonsThatStartsWith(searchTerm)

        // Vérifie que le tableau est vide.
        expect(pokemons).to.be.an('array').that.is.empty
    })

    it("should correctly handle pokemons with specified search and generation", async () => {
        const searchTerm = 'Sala'
        const generation = 1 // On filtre par la 1ère génération dans cet exemple.
        const pokemons = await pokemonDAO.findPokemonsThatStartsWith(
            searchTerm, generation
        )

        expect(pokemons).to.be.an('array').that.is.not.empty

        expect(pokemons).to.satisfy(pokemons =>
            pokemons.every(pokemon =>
                pokemon.nom.startsWith(searchTerm) && pokemon.generation === generation
            )
        )
    })

    it("should return no pokemons with an invalid generation", async () => {
        const pokemons = await pokemonDAO.findPokemonsThatStartsWith(
            'Cara', 0, undefined, undefined,
        )
        expect(pokemons).to.be.an('array').that.is.empty
    })

    it("should return pokemons of specified search with generation and type", async () => {
        const pokemons = await pokemonDAO.findPokemonsThatStartsWith(
            'B', 3, 'Feu', undefined,
        )
        expect(pokemons).to.be.an('array').that.is.lengthOf(1)
        const pokemon = pokemons[0]
        expect(pokemon.nom).to.equal('Braségali')
        expect(pokemon.generation).to.equal(3)
        expect(pokemon.types).to.include('Feu')
    })

    it("should return pokemons of specified search, generation and both type", async () => {
        const pokemons = await pokemonDAO.findPokemonsThatStartsWith(
            'O', 1, 'Plante', 'Poison'
        )

        expect(pokemons).to.be.an('array').that.is.lengthOf(1)
        const pokemon = pokemons[0]
        expect(pokemon.nom).to.equal('Ortide')
        expect(pokemon.generation).to.equal(1)
        expect(pokemon.types).to.includes(...['Plante', 'Poison'])
    })

    it("should return pokemons of specified search and type", async () => {
        const pokemons = await pokemonDAO.findPokemonsThatStartsWith(
            'C', undefined, 'Combat', undefined
        )
        expect(pokemons).to.be.an('array').that.is.not.empty
        expect(pokemons.length).to.equal(12)
        expect(pokemons).to.satisfy(pokemons =>
            pokemons.every(pokemon =>
                pokemon.types.includes('Combat') &&
                pokemon.nom.startsWith('C')
        ))
    })

    it("should return pokemons of specified search and both type", async () => {
        const pokemons = await pokemonDAO.findPokemonsThatStartsWith(
            'P', undefined, 'Normal', 'Vol'
        )
        expect(pokemons).to.be.an('array').that.is.not.empty
        expect(pokemons.length).to.equal(6)
        expect(pokemons).to.satisfy(pokemons =>
            pokemons.every(pokemon =>
                pokemon.types.includes('Normal') &&
                pokemon.types.includes('Vol') &&
                pokemon.nom.startsWith('P')
        ))
    })

    it("should return pokemons with search without taking consideration of type2 without type1", async () => {
        const pokemons = await pokemonDAO.findPokemonsThatStartsWith('M', undefined, undefined, 'Feu')
        expect(pokemons).to.be.an('array').that.is.not.empty
        expect(pokemons).to.satisfy(pokemons =>
            pokemons.some(pokemon => !pokemon.types.includes('Feu')) &&
            pokemons.every(pokemon => pokemon.nom.startsWith('M'))
        )
    })

    it("should return a limited number of pokemons when a limit is specified", async () => {
        const limit = 5
        const pokemons = await pokemonDAO.findPokemonsThatStartsWith(
            'A', undefined, undefined, undefined, limit
        )
        expect(pokemons).to.be.an('array')
        expect(pokemons.length).to.equal(limit)
    })

    it(`should return ${pokemonDAO.LIMIT} pokemons when limit is errored`, async () => {
        const pokemons = await pokemonDAO.findPokemonsThatStartsWith(
            'A', undefined, undefined, undefined, NaN
        )
        expect(pokemons).to.be.an('array').that.is.not.empty
        expect(pokemons.length).to.equal(pokemonDAO.LIMIT)
    })
})

describe('findPokemonsByMove', () => {
    it("should return pokemons that can learn a specified move", async () => {
        // Coupe-Vent est la capacité ayant pour id 13
        const pkmApprenantCoupeVent = pokemonsData.filter(
            p => p.capacites.includes(13)
        ).map(p => p.nomAnglais) // On récupère les noms anglais qui ont cette capacité.

        /* findPokemonsByMove se sert de la colonne 'pokemons' d'une capacité pour
         mapper les Pokémon qui peuvent apprendre cette attaque. */
        const pokemons = await pokemonDAO.findPokemonsByMove({pokemons: pkmApprenantCoupeVent})
        expect(pokemons).to.satisfy(pokemons =>
            pokemons.every(pokemon =>
                pokemon.capacites.includes(13) &&
                pkmApprenantCoupeVent.includes(pokemon.nomAnglais)
            )
        )
    })
})