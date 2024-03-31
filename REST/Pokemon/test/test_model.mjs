"use strict"

import { expect } from "chai"
import mongoose from "mongoose"
import {MongoMemoryServer} from "mongodb-memory-server"
import Pokemon from "../api/model/Pokemon.mjs"

const createDB = async () => {
    await mongoose.connection.close()
    const mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    await mongoose.connect(uri)
}

const deleteEverything = async () => await Pokemon.deleteMany({})

describe("Pokemon model validation", () => {
    before(createDB)

    beforeEach(deleteEverything)

    const createPkmExpectDuplicateError = async (pokemonData) => {
        try {
            await Pokemon.create([pokemonData], null)

            // Ceci indique que le test a échoué si aucune erreur n'est levée
            expect.fail("Should have thrown an duplicate error")
        } catch (error) {
            expect(error.code).to.equal(11000) // MongoDB duplicate key error
        }
    }

    it("should enforce unique constraints on various fields", async () => {
        const basePokemon = { id: 1, nom: "Pikachu", nomAnglais: "pikachu", nomNormalise: "pikachu" }
        await Pokemon.create([basePokemon], null)

        const secondPokemon = { id: 2, nom: "Pikachu2", nomAnglais: "pikachu2", nomNormalise: "pikachu2" }

        // Teste la violation de l'unicité de l'`id`
        await createPkmExpectDuplicateError({ ...secondPokemon, id: 1 })

        // Teste la violation de l'unicité du `nom`
        await createPkmExpectDuplicateError({ ...secondPokemon, nom: "Pikachu" })

        // Teste la violation de l'unicité du `nomAnglais`
        await createPkmExpectDuplicateError({ ...secondPokemon, nomAnglais: "pikachu" })

        // Teste la violation de l'unicité du `nomNormalise`
        await createPkmExpectDuplicateError({ ...secondPokemon, nomNormalise: "pikachu" })
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
            // Ceci vérifie qu'une erreur de validation existe pour le champ 'poids'
            expect(error.errors.poids).to.exist
            // Ceci vérifie que l'erreur est due à la règle 'min'
            expect(error.errors.poids.kind).to.equal('min')
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
            // Ceci vérifie qu'une erreur de validation existe pour le champ 'poids'
            expect(error.errors.taille).to.exist
            // Ceci vérifie que l'erreur est due à la règle 'min'
            expect(error.errors.taille.kind).to.equal('min')
        }
    })


})
