"use strict"

import {expect} from "chai"
import mongoose from "mongoose"
import {MongoMemoryServer} from "mongodb-memory-server"
import pokemonDAO from "../api/dao/pokemonDAO.mjs"
import pokemonsData from "./pokemonsData.mjs"

describe('PokemonDAO', () => {
    before(async () => {
        await mongoose.connection.close()
        const mongoServer = await MongoMemoryServer.create()
        const uri = mongoServer.getUri()
        await mongoose.connect(uri)
        await pokemonDAO.insertAll(await pokemonsData())
    })

    describe('• getPokemons', () => {
        it("should return Pokemons", async () => {
            const pokemons = await pokemonDAO.getPokemons()
            expect(pokemons).to.be.an('array').that.is.not.empty

            const allKeys = new Set([
                'capacites', 'description', 'espece', 'generation',
                'nom', 'nomAnglais', 'nomNormalise', 'poids', 'id',
                'sprites', 'stats', 'taille', 'talents', 'types'
            ])

            expect(pokemons).to.satisfy(() =>
                pokemons.every(pokemon => {
                    const pokemonKeys = Object.keys(pokemon)
                    return pokemonKeys.every(key => allKeys.has(key))
                })
            )
        })

        it("should return no Pokemon with invalid generation", async () => {
            const pokemons = await pokemonDAO.getPokemons(0)
            expect(pokemons).to.be.an('array').that.is.empty
        })

        ;[1,5,8].forEach(gen => {
            it(`should return Pokemons of generation ${gen}`, async () => {
                const pokemons = await pokemonDAO.getPokemons(gen)
                expect(pokemons).to.be.an('array').that.is.not.empty
                expect(pokemons).to.satisfy(() =>
                    pokemons.every(pokemon => pokemon.generation === gen))
            })
        })

        it("should return Pokemons of generation 4 and type Fire", async () => {
            const pokemons = await pokemonDAO.getPokemons(4, 'Feu')
            expect(pokemons).to.be.an('array').that.is.not.empty
            expect(pokemons).to.satisfy(() =>
                pokemons.every(pokemon =>
                    pokemon.generation === 4 && pokemon.types.includes('Feu')
                ))
        })

        it("should return Pokemons of generation 1 and both type Grass and Poison", async () => {
            const pokemons = await pokemonDAO.getPokemons(1, 'Plante', 'Poison')
            expect(pokemons).to.be.an('array').that.is.not.empty
            expect(pokemons).to.satisfy(() =>
                pokemons.every(pokemon =>
                    pokemon.generation === 1 &&
                    pokemon.types.includes('Plante') &&
                    pokemon.types.includes('Poison')
                ))
        })

        it("should return Pokemons of type Fighting", async () => {
            const pokemons = await pokemonDAO.getPokemons(undefined, 'Combat')
            expect(pokemons).to.be.an('array').that.is.not.empty
            expect(pokemons).to.satisfy(() =>
                pokemons.every(pokemon => pokemon.types.includes('Combat'))
            )
        })

        it("should return Pokemons of both type Grass and Poison", async () => {
            const pokemons = await pokemonDAO.getPokemons(
                undefined, 'Plante', 'Poison'
            )
            expect(pokemons).to.be.an('array').that.is.not.empty
            expect(pokemons).to.satisfy(() =>
                pokemons.every(pokemon =>
                    pokemon.types.includes('Plante') && pokemon.types.includes('Poison')
                ))
        })

        it("should return Pokemons without taking consideration of type Fire without type1 defined", async () => {
            const pokemons = await pokemonDAO.getPokemons(undefined, undefined, 'Feu')
            expect(pokemons).to.be.an('array').that.is.not.empty
            expect(pokemons).to.satisfy(() =>
                pokemons.some(pokemon => !pokemon.types.includes('Feu'))
            )
        })

        it("should return a limited number of Pokemons when a limit is specified", async () => {
            const limit = 5
            const pokemons = await pokemonDAO.getPokemons(
                undefined, undefined, undefined, limit
            )
            expect(pokemons).to.be.an('array')
            expect(pokemons.length).to.equal(limit)
        })

        it(`should return ${pokemonDAO.LIMIT} Pokemon when limit is errored`, async () => {
            const pokemons = await pokemonDAO.getPokemons(
                undefined, undefined, undefined, NaN
            )
            expect(pokemons).to.be.an('array').that.is.not.empty
            expect(pokemons.length).to.equal(pokemonDAO.LIMIT)
        })
    })

    describe('• findPokemonById', () => {
        it('should return a Pokemon with the specified id', async () => {
            const pokemon = await pokemonDAO.findPokemonById(200)
            expect(pokemon).to.not.be.null
            expect(pokemon.nom).to.equal('Feuforêve')
            expect(pokemon.id).to.equal(200)
        })

        it('should return null with a non existing Pokemon id', async () => {
            const pokemon = await pokemonDAO.findPokemonById(0)
            expect(pokemon).to.be.null
        })

        it('should return null with an invalid Pokemon id', async () => {
            const pokemon = await pokemonDAO.findPokemonById(NaN)
            expect(pokemon).to.be.null
        })
    })

    describe('• findPokemonsThatStartsWith', () => {
        it('should return Pokemons whose names start with the specified term', async () => {
            const searchTerm = 'B'
            const pokemons = await pokemonDAO.findPokemonsThatStartsWith(searchTerm)

            // Vérifie que le tableau n'est pas vide.
            expect(pokemons).to.be.an('array').that.is.not.empty

            // Vérifie que chaque Pokémon retourné commence bien par le terme de recherche.
            expect(pokemons).to.satisfy(() =>
                pokemons.every(pokemon => pokemon.nom.startsWith(searchTerm))
            )
        })

        it('should return no Pokemon for an unmatched search term', async () => {
            const searchTerm = 'Zyx' // Un terme qui ne correspond à aucun nom de Pokémon.
            const pokemons = await pokemonDAO.findPokemonsThatStartsWith(searchTerm)

            // Vérifie que le tableau est vide.
            expect(pokemons).to.be.an('array').that.is.empty
        })

        it('should return Pokemons with specified search and generation', async () => {
            const searchTerm = 'Sala'
            const generation = 1 // On filtre par la 1ère génération dans cet exemple.
            const pokemons = await pokemonDAO.findPokemonsThatStartsWith(
                searchTerm, generation
            )

            expect(pokemons).to.be.an('array').that.is.not.empty

            expect(pokemons).to.satisfy(() =>
                pokemons.every(pokemon =>
                    pokemon.nom.startsWith(searchTerm) && pokemon.generation === generation
                )
            )
        })

        it('should return no Pokemons with an invalid generation', async () => {
            const pokemons = await pokemonDAO.findPokemonsThatStartsWith(
                'Cara', 0
            )
            expect(pokemons).to.be.an('array').that.is.empty
        })

        it('should return Pokemons of specified search with generation and type', async () => {
            const pokemons = await pokemonDAO.findPokemonsThatStartsWith(
                'B', 3, 'Feu'
            )
            expect(pokemons).to.be.an('array').that.is.lengthOf(1)
            const pokemon = pokemons[0]
            expect(pokemon.nom).to.equal('Braségali')
            expect(pokemon.generation).to.equal(3)
            expect(pokemon.types).to.include('Feu')
        })

        it('should return Pokemons of specified search, generation and both type', async () => {
            const pokemons = await pokemonDAO.findPokemonsThatStartsWith(
                'O', 1, 'Plante', 'Poison'
            )

            expect(pokemons).to.be.an('array').that.is.lengthOf(1)
            const pokemon = pokemons[0]
            expect(pokemon.nom).to.equal('Ortide')
            expect(pokemon.generation).to.equal(1)
            expect(pokemon.types).to.includes(...['Plante', 'Poison'])
        })

        it('should return Pokemons of specified search and type', async () => {
            const pokemons = await pokemonDAO.findPokemonsThatStartsWith(
                'C', undefined, 'Combat'
            )
            expect(pokemons).to.be.an('array').that.is.not.empty
            expect(pokemons).to.satisfy(() =>
                pokemons.every(pokemon =>
                    pokemon.types.includes('Combat') &&
                    pokemon.nom.startsWith('C')
            ))
        })

        it('should return Pokemons of specified search and both type', async () => {
            const pokemons = await pokemonDAO.findPokemonsThatStartsWith(
                'P', undefined, 'Normal', 'Vol'
            )
            expect(pokemons).to.be.an('array').that.is.not.empty
            expect(pokemons.length).to.equal(6)
            expect(pokemons).to.satisfy(() =>
                pokemons.every(pokemon =>
                    pokemon.types.includes('Normal') &&
                    pokemon.types.includes('Vol') &&
                    pokemon.nom.startsWith('P')
                ))
        })

        it('should return Pokemons with search without taking consideration of type2 without type1', async () => {
            const pokemons = await pokemonDAO.findPokemonsThatStartsWith('M', undefined, undefined, 'Feu')
            expect(pokemons).to.be.an('array').that.is.not.empty
            expect(pokemons).to.satisfy(() =>
                pokemons.some(pokemon => !pokemon.types.includes('Feu')) &&
                pokemons.every(pokemon => pokemon.nom.startsWith('M'))
            )
        })

        it("should return a limited number of Pokemons when a limit is specified", async () => {
            const limit = 5
            const pokemons = await pokemonDAO.findPokemonsThatStartsWith(
                'A', undefined, undefined, undefined, limit
            )
            expect(pokemons).to.be.an('array')
            expect(pokemons.length).to.equal(limit)
        })

        it(`should return ${pokemonDAO.LIMIT} Pokemons when limit is errored`, async () => {
            const searchTerm = 'A'
            const pokemons = await pokemonDAO.findPokemonsThatStartsWith(
                searchTerm, undefined, undefined, undefined, NaN
            )
            expect(pokemons).to.be.an('array').that.is.lengthOf(pokemonDAO.LIMIT)
            expect(pokemons).to.satisfy(() =>
                pokemons.every(pokemon => pokemon.nom.startsWith(searchTerm))
            )
        })
    })

    describe('• findPokemonsByMove', () => {
        it('should return Pokemons that can learn a specified move', async () => {
            // Coupe-Vent est la capacité ayant pour id 13
            const pkmApprenantCoupeVent = [
                "bulbasaur", "butterfree", "pidgey", "pidgeotto", "pidgeot",
                "spearow", "fearow", "zubat", "golbat", "venomoth", "farfetchd",
                "horsea", "scyther", "kabutops", "aerodactyl", "articuno", "zapdos",
                "moltres", "dragonite", "mew", "totodile", "girafarig", "gligar",
                "scizor", "treecko", "seedot", "nuzleaf", "zangoose", "tropius",
                "absol", "buizel", "floatzel", "pidove", "tranquill", "unfezant",
                "sewaddle", "axew", "fletchling", "fletchinder", "talonflame", "helioptile",
                "heliolisk", "noibat", "noivern", "yveltal", "type-null", "silvally",
                "drampa", "scizor-mega", "absol-mega", "pidgeot-mega"
            ]

            /* findPokemonsByMove se sert de la colonne 'pokemons' d'une capacité pour
             mapper les Pokémon qui peuvent apprendre cette attaque. */
            const pokemons = await pokemonDAO.findPokemonsByMove({pokemons: pkmApprenantCoupeVent})
            expect(pokemons).to.be.an('array').that.is.not.empty
            expect(pokemons).to.satisfy(() =>
                pokemons.every(pokemon =>
                    pokemon.capacites.includes(13) &&
                    pkmApprenantCoupeVent.includes(pokemon.nomAnglais)
                )
            )
        })
    })
})