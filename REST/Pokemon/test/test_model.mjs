"use strict"

import {expect} from "chai"
import mongoose from "mongoose"
import {MongoMemoryServer} from "mongodb-memory-server"
import Pokemon from "../api/model/Pokemon.mjs"

describe("Pokemon model validation", () => {
    before(async () => {
        await mongoose.connection.close()
        const mongoServer = await MongoMemoryServer.create()
        const uri = mongoServer.getUri()
        await mongoose.connect(uri)
    })

    beforeEach(async () => await Pokemon.deleteMany({}))

    it("should enforce unique constraints on various fields", async () => {
        const basePokemon = { id: 1, nom: "Pikachu", nomAnglais: "pikachu", nomNormalise: "pikachu" }
        await Pokemon.create([basePokemon], null)

        const secondPokemon = { id: 2, nom: "Pikachu2", nomAnglais: "pikachu2", nomNormalise: "pikachu2" }

        const createPkmExpectDuplicateError = async (duplicateField) => {
            try {
                await Pokemon.create([{...secondPokemon, ...duplicateField}], null)

                // Ceci indique que le test a échoué si aucune erreur n'est levée
                expect.fail("Should have thrown an duplicate error")
            } catch (error) {
                expect(error.name).to.equal('MongoServerError')
                expect(error.code).to.equal(11000) // MongoDB duplicate key error
            }
        }

        // Teste la violation de l'unicité de l'`id`
        await createPkmExpectDuplicateError({ id: 1 })

        // Teste la violation de l'unicité du `nom`
        await createPkmExpectDuplicateError({ nom: "Pikachu" })

        // Teste la violation de l'unicité du `nomAnglais`
        await createPkmExpectDuplicateError({ nomAnglais: "pikachu" })

        // Teste la violation de l'unicité du `nomNormalise`
        await createPkmExpectDuplicateError({ nomNormalise: "pikachu" })
    })

    it('should fail to create a Pokemon without required fields', async () => {
        const pokemonData = {
            id: 1, nom: 'Bulbizarre',
            nomNormalise: 'bulbizarre',
            nomAnglais: 'bulbasaur'
        }

        const createPkmExpectRequiredError = async (field) => {
            const {[field]: omitted, ...pkmDataWthField} = pokemonData

            try {
                await Pokemon.create([pkmDataWthField], null)
                // Ceci indique que le test a échoué si aucune erreur n'est levée
                expect.fail('Should have thrown an rule error')
            } catch (error) {
                expect(error.name).to.equal('ValidationError')
                // Ceci vérifie qu'une erreur de validation existe
                expect(error.errors[field]).to.exist
                // Ceci vérifie que l'erreur est due à la règle 'required'
                expect(error.errors[field].kind).to.equal('required')
            }
        }

        await createPkmExpectRequiredError('id')
        await createPkmExpectRequiredError('nom')
        await createPkmExpectRequiredError('nomAnglais')
        await createPkmExpectRequiredError('nomNormalise')
    })

    it('should fail to create a Pokemon with a negative weight', async () => {
        const pokemonData = {
            id: 1, nom: 'Bulbizarre', nomAnglais: 'bulbasaur',
            nomNormalise: 'bulbizarre', poids: -10
        }

        try {
            await Pokemon.create([pokemonData], null)

            // Ceci indique que le test a échoué si aucune erreur n'est levée
            expect.fail('Should have thrown an rule error')
        } catch (error) {
            expect(error.name).to.equal('ValidationError')
            // Ceci vérifie qu'une erreur de validation existe pour le champ 'poids'
            expect(error.errors.poids).to.exist
            // Ceci vérifie que l'erreur est due à la règle 'min'
            expect(error.errors.poids.kind).to.equal('min')
        }
    })

    it('should fail to create a Pokemon with a weight over 999.9', async () => {
        const pokemonData = {
            id: 1, nom: 'Bulbizarre', nomAnglais: 'bulbasaur',
            nomNormalise: 'bulbizarre', poids: 1000
        }

        try {
            await Pokemon.create([pokemonData], null)

            // Ceci indique que le test a échoué si aucune erreur n'est levée
            expect.fail('Should have thrown an rule error')
        } catch (error) {
            expect(error.name).to.equal('ValidationError')
            // Ceci vérifie qu'une erreur de validation existe pour le champ 'poids'
            expect(error.errors.poids).to.exist
            // Ceci vérifie que l'erreur est due à la règle 'min'
            expect(error.errors.poids.kind).to.equal('max')
        }
    })

    it('should fail to create a Pokemon with a negative height', async () => {
        const pokemonData = {
            id: 1, nom: 'Bulbizarre', nomAnglais: 'bulbasaur',
            nomNormalise: 'bulbizarre', taille: -10
        }

        try {
            await Pokemon.create([pokemonData], null)

            // Ceci indique que le test a échoué si aucune erreur n'est levée
            expect.fail('Should have thrown an rule error')
        } catch (error) {
            expect(error.name).to.equal('ValidationError')
            // Ceci vérifie qu'une erreur de validation existe pour le champ 'poids'
            expect(error.errors.taille).to.exist
            // Ceci vérifie que l'erreur est due à la règle 'min'
            expect(error.errors.taille.kind).to.equal('min')
        }
    })

    it('should fail to create a Pokemon with a generation less or equal to 0', async () => {
        const pokemonData = {
            id: 1, nom: 'Bulbizarre', nomAnglais: 'bulbasaur',
            nomNormalise: 'bulbizarre', generation: 0
        }

        try {
            await Pokemon.create([pokemonData], null)

            // Ceci indique que le test a échoué si aucune erreur n'est levée
            expect.fail('Should have thrown an rule error')
        } catch (error) {
            expect(error.name).to.equal('ValidationError')
            // Ceci vérifie qu'une erreur de validation existe pour le champ 'poids'
            expect(error.errors?.generation).to.exist
            // Ceci vérifie que l'erreur est due à la règle 'min'
            expect(error.errors?.generation.kind).to.equal('min')
        }
    })

    it('should be fine to create a valid Pokemon', async () => {
        const pokemonData = {
            capacites: [1, 2, 3],
            description: "La description d'un Pokémon fictif.",
            espece: "Pokémon Fictif",
            generation: 1,
            id: 1,
            nom: "Fictif",
            nomAnglais: "imaginary",
            nomNormalise: "fictif",
            poids: 7.0,
            sprites: {default: '', shiny: ''},
            stats: {
                hp: 45, attack: 49,
                defense: 49, special_attack: 65,
                special_defense: 65, speed: 45
            },
            taille: 1.0,
            talents: {
                normaux: ["Talent normal"],
                cache: "Talent caché"
            },
            types: ["Type1", "Type2"]
        }

        // Tentative d'ajout du Pokémon
        await Pokemon.create([pokemonData], null)

        // Vérification que le Pokémon créé est retrouvable
        const foundPokemon = await Pokemon.findOne(
            { id: pokemonData.id },
            {_id: 0},
            null
        )

        expect(foundPokemon).to.not.be.null
        expect(foundPokemon['_doc']).to.deep.equal(pokemonData)
    })
})