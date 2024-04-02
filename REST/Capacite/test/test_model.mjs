"use strict"

import {expect} from "chai"
import mongoose from "mongoose"
import {MongoMemoryServer} from "mongodb-memory-server"
import Capacite from "../api/model/Capacite.mjs"

describe("Capacité model validation", () => {
    before(async () => {
        await mongoose.connection.close()
        const mongoServer = await MongoMemoryServer.create()
        const uri = mongoServer.getUri()
        await mongoose.connect(uri)
    })

    beforeEach(async () => await Capacite.deleteMany({}))

    it("should enforce unique constraints on various fields", async () => {
        const baseMove = {
            id: 1, nom: 'Écras’Face',
            nomAnglais: 'pound',
            categorie: 'Physique',
            nomNormalise: 'ecras’face'
        }
        await Capacite.create([baseMove], null)

        const secondMove = {
            id: 2, nom:'Écras’Face2',
            nomAnglais: 'pound2',
            categorie: 'Physique',
            nomNormalise: 'ecras’face2'
        }

        const createMoveExpectDuplicateError = async (duplicateField) => {
            try {
                await Capacite.create([{...secondMove, ...duplicateField}], null)

                // Ceci indique que le test a échoué si aucune erreur n'est levée
                expect.fail("Should have thrown an duplicate error")
            } catch (error) {
                expect(error.name).to.equal('MongoServerError')
                expect(error.code).to.equal(11000) // MongoDB duplicate key error
            }
        }

        // Teste la violation de l'unicité de l'`id`
        await createMoveExpectDuplicateError({ id: 1 })

        // Teste la violation de l'unicité du `nomAnglais`
        await createMoveExpectDuplicateError({ nomAnglais: "pound" })
    })

    it('should fail to create a Move without required fields', async () => {
        const moveData = {
            id: 1, nom: "Écras’Face",
            categorie: 'Physique',
            nomAnglais: "pound",
            nomNormalise: "ecras’face"
        }

        const createMoveExpectRequiredError = async (field) => {
            const {[field]: omitted, ...moveDataWthField} = moveData

            try {
                await Capacite.create([moveDataWthField], null)
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

        await createMoveExpectRequiredError('id')
        await createMoveExpectRequiredError('nom')
        await createMoveExpectRequiredError('nomAnglais')
        await createMoveExpectRequiredError('nomNormalise')
        await createMoveExpectRequiredError('categorie')
    })

    it('should fail to create a Move with an invalid category', async () => {
        // TODO
    })
})