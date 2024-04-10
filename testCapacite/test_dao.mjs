"use strict"

import {expect} from "chai"
import mongoose from "mongoose"
import {MongoMemoryServer} from "mongodb-memory-server"
import capaciteDAO from "../api/dao/capaciteDAO.mjs"
import capacitesData from "./capacitesData.mjs"

describe('CapaciteDAO', () => {
    before(async () => {
        await mongoose.connection.close()
        const mongoServer = await MongoMemoryServer.create()
        const uri = mongoServer.getUri()
        await mongoose.connect(uri)
        await capaciteDAO.insertAll(await capacitesData())
    })

    describe('• getMoves', () => {
        it('should return Moves', async () => {
            const moves = await capaciteDAO.getMoves()
            expect(moves).to.be.an('array').that.is.not.empty

            const allKeys = new Set([
                'id', 'nom', 'nomAnglais', 'nomNormalise',
                'description', 'pp', 'precision', 'type',
                'pokemons', 'categorie', 'puissance'
            ])

            expect(moves).satisfy(() =>
                moves.every(move => {
                    const moveKeys = Object.keys(move)
                    return moveKeys.every(key => allKeys.has(key))
                })
            )
        })

        it('should return Moves of type Electrik', async () => {
            const moves = await capaciteDAO.getMoves('Électrik')
            expect(moves).to.be.an('array').that.is.not.empty
            expect(moves).to.satisfy(() =>
                moves.every(move => move.type === 'Électrik')
            )
        })

        it('should return Moves of category Status', async () => {
            const moves = await capaciteDAO.getMoves(undefined, 'Statut')
            expect(moves).to.be.an('array').that.is.not.empty
            expect(moves).to.satisfy(() =>
                moves.every(move => move.categorie === 'Statut')
            )
        })

        it('should return Moves of type Ghost and of category Physical', async () => {
            const moves = await capaciteDAO.getMoves('Spectre', 'Physique')
            expect(moves).to.be.an('array').that.is.not.empty
            expect(moves).to.satisfy(() =>
                moves.every(move =>
                    move.type === 'Spectre' &&
                    move.categorie === 'Physique'
            ))
        })

        it("should return a limited number of Moves when a limit is specified", async () => {
            const limit = 5
            const moves = await capaciteDAO.getMoves(
                undefined, undefined, limit
            )
            expect(moves).to.be.an('array')
            expect(moves.length).to.equal(limit)
        })

        it(`should return ${capaciteDAO.LIMIT} Move when limit is errored`, async () => {
            const pokemons = await capaciteDAO.getMoves(
                undefined, undefined, NaN
            )
            expect(pokemons).to.be.an('array').that.is.not.empty
            expect(pokemons.length).to.equal(capaciteDAO.LIMIT)
        })
    })

    describe('• findMoveById', () => {
        it('should return a Move with specified id', async () => {
            const move = await capaciteDAO.findMoveById(496)
            expect(move).to.not.be.null
            expect(move.nom).to.equal('Chant Canon')
            expect(move.id).to.equal(496)
        })

        it('should return null with a non existing Move id', async () => {
            const pokemon = await capaciteDAO.findMoveById(0)
            expect(pokemon).to.be.null
        })

        it('should return null with an invalid Move id', async () => {
            const move = await capaciteDAO.findMoveById(NaN)
            expect(move).to.be.null
        })
    })

    describe('• findMovesThatStartsWith', () => {
        it('should return Moves whose names start with the specified term', async () => {
            const searchTerm = 'Lame'
            const moves = await capaciteDAO.findMovesThatStartsWith(searchTerm)

            expect(moves).to.be.an('array').that.is.not.empty

            expect(moves).to.satisfy(() =>
                moves.every(move => move.nom.startsWith(searchTerm))
            )
        })

        it('should return no Move for an unmatched search term', async () => {
            const searchTerm = 'Zyx' // Un terme qui ne correspond à aucun nom de Capacités.
            const moves = await capaciteDAO.findMovesThatStartsWith(searchTerm)

            // Vérifie que le tableau est vide.
            expect(moves).to.be.an('array').that.is.empty
        })

        it('should return Moves of specified search and type', async () => {
            const searchTerm = 'Mé'
            const type = 'Acier'
            const moves = await capaciteDAO.findMovesThatStartsWith(searchTerm, type)
            expect(moves).to.be.an('array').that.is.not.empty
            expect(moves).to.satisfy(() =>
                moves.every(move =>
                    move.type === type &&
                    move.nom.startsWith(searchTerm)
            ))
        })

        it('should return Moves of specified search and category', async () => {
            const searchTerm = 'Vib'
            const categorie = 'Spéciale'
            const moves = await capaciteDAO.findMovesThatStartsWith(
                searchTerm, undefined, categorie
            )
            expect(moves).to.be.an('array').that.is.not.empty
            expect(moves).to.satisfy(() =>
                moves.every(move =>
                    move.categorie === categorie &&
                    move.nom.startsWith(searchTerm)
            ))
        })

        it('should return Moves of specified search, type and category', async () => {
            const searchTerm = 'B'
            const type = 'Poison'
            const categorie = 'Spéciale'
            const moves = await capaciteDAO.findMovesThatStartsWith(
                searchTerm, type, categorie
            )

            expect(moves).to.be.an('array').that.is.not.empty
            expect(moves).to.satisfy(() =>
                moves.every(move =>
                    move.type === type &&
                    move.categorie === categorie &&
                    move.nom.startsWith(searchTerm)
            ))
        })

        it("should return a limited number of Moves when a limit is specified", async () => {
            const limit = 5
            const moves = await capaciteDAO.findMovesThatStartsWith(
                'A', undefined, undefined, limit
            )
            expect(moves).to.be.an('array')
            expect(moves.length).to.equal(limit)
        })

        it(`should return ${capaciteDAO.LIMIT} Pokemons when limit is errored`, async () => {
            const moves = await capaciteDAO.findMovesThatStartsWith(
                'A', undefined, undefined, NaN
            )
            expect(moves).to.be.an('array').that.is.not.empty
            expect(moves.length).to.equal(capaciteDAO.LIMIT)
        })
    })

    describe('• findMovesByPokemon', () => {
        it('should return Moves that can be learned by a specified pokemon', async () => {
            // Felinferno est le pokémon d'id 727
            const capDeFelinferno = [
                5, 6, 7, 9, 10, 14, 20, 24, 25, 34, 36, 37, 38,
                43, 44, 45, 46, 52, 53, 63, 67, 83, 89, 92, 104,
                122, 126, 141, 154, 156, 164, 168, 173, 179, 182,
                184, 200, 203, 207, 213, 214, 216, 218, 226, 237,
                238, 241, 242, 252, 257, 259, 261, 263, 264, 269,
                270, 276, 279, 280, 282, 283, 289, 299, 307, 315,
                332, 339, 343, 369, 370, 372, 373, 374, 394, 399,
                409, 411, 416, 417, 421, 424, 442, 488, 490, 496,
                511, 512, 519, 523, 526, 530, 535, 555, 575, 590,
                663, 675, 681, 693, 707, 807, 808, 815
            ]

            const moves = await capaciteDAO.findMovesByPokemon({capacites: capDeFelinferno})
            expect(moves).to.be.an('array').that.is.not.empty
            expect(moves).to.satisfy(() =>
                moves.every(move =>
                    move.pokemons.includes('incineroar') &&
                    capDeFelinferno.includes(move.id)
                )
            )
        })
    })
})