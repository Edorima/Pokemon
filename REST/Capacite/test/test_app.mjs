"use strict"

import {expect} from "chai"
import supertest from 'supertest'
import server from '../server.mjs'

const requestWithSupertest = supertest(server)

describe('Capacite Routes', () => {
    describe('• GET /capacite', () => {
        it('should return Moves', async () => {
            const response = await requestWithSupertest.get('/capacite')
            expect(response.status).to.equal(200)
            expect(response.body).to.be.an('array').that.is.not.empty
        })

        it('should return Moves with type Fairy', async () => {
            const response = await requestWithSupertest.get('/capacite?type=Fée')
            expect(response.status).to.equal(200)
            const moves = response.body
            expect(moves).to.be.an('array').that.is.not.empty
            expect(moves).to.satisfy(() =>
                moves.every(move => move.type === 'Fée')
            )
        })

        it('should return Moves with category Special', async () => {
            const response = await requestWithSupertest.get('/capacite?categorie=Spéciale')
            expect(response.status).to.equal(200)
            const moves = response.body
            expect(moves).to.be.an('array').that.is.not.empty
            expect(moves).to.satisfy(() =>
                moves.every(move => move.categorie === 'Spéciale')
            )
        })

        it('should return Moves with type Water and category Status', async () => {
            const response = await requestWithSupertest.get('/capacite?type=Eau&categorie=Statut')
            expect(response.status).to.equal(200)
            const moves = response.body
            expect(moves).to.be.an('array').that.is.not.empty
            expect(moves).to.satisfy(() =>
                moves.every(move => move.type === 'Eau' && move.categorie === 'Statut')
            )
        })

        it('should return only certain amount of Move with limit set', async () => {
            const response = await requestWithSupertest.get('/capacite?limit=5')
            expect(response.status).to.equal(200)
            expect(response.body).to.be.an('array').that.is.lengthOf(5)
        })

        it('should return Moves skipped by a specified offset', async () => {
            const response = await requestWithSupertest.get('/capacite?offset=5')
            expect(response.status).to.equal(200)
            const body = response.body
            expect(body).to.be.an('array').that.is.not.empty

            let expectedId = 6
            expect(body).satisfy(moves =>
                moves.every(move => move.id === expectedId++)
            )
        })
    })

    describe('• GET /capacite/:id', () => {
        it('should return a Move', async () => {
            const response = await requestWithSupertest.get('/capacite/1')
            expect(response.status).to.equal(200)
            const move = response.body
            expect(move).to.be.an('object')
            expect(move).to.satisfy(() =>
                move.nom === 'Écras’Face' && move.id === 1
            )
        })

        it("should not found a Move whose id doesn't exist", async () => {
            const response = await requestWithSupertest.get('/capacite/-1')
            expect(response.status).to.equal(404)
            expect(response.body).to.deep.equal({message: 'Move Not Found'})
        })

        it('should not found a Move with invalid id', async () => {
            const response = await requestWithSupertest.get('/capacite/Invalid')
            expect(response.status).to.equal(404)
            expect(response.body).to.deep.equal({message: 'Move Not Found'})
        })
    })

    describe('• GET /capacite/startsWith/:searchTerm', () => {
        it('should return Moves matching searchTerm', async () => {
            const response = await requestWithSupertest.get('/capacite/startsWith/Canon')
            expect(response.status).to.equal(200)
            const moves = response.body
            expect(moves).to.be.an('array').that.is.not.empty
            expect(moves).to.satisfy(() =>
                moves.every(move => move.nom.startsWith('Canon'))
            )
        })

        it('should return Moves of type Grass with matching searchTerm', async () => {
            const response = await requestWithSupertest.get('/capacite/startsWith/B?type=Plante')
            expect(response.status).to.equal(200)
            const moves = response.body
            expect(moves).to.be.an('array').that.is.not.empty
            expect(moves).to.satisfy(() =>
                moves.every(move => move.nom.startsWith('B') && move.type === 'Plante'))
        })

        it('should return Moves of category Physical with matching searchTerm', async () => {
            const response = await requestWithSupertest.get('/capacite/startsWith/Poing?categorie=Physique')
            expect(response.status).to.equal(200)
            const moves = response.body
            expect(moves).to.be.an('array').that.is.not.empty
            expect(moves).to.satisfy(() =>
                moves.every(move => move.nom.startsWith('Poing') && move.categorie === 'Physique')
            )
        })

        it('should return Moves of type Ground and category Physical with matching searchTerm', async () => {
            const response = await requestWithSupertest.get('/capacite/startsWith/T?type=Sol&categorie=Physique')
            expect(response.status).to.equal(200)
            const moves = response.body
            expect(moves).to.be.an('array').that.is.not.empty
            expect(moves).to.satisfy(() =>
                moves.every(move =>
                    move.nom.startsWith('T') &&
                    move.type === 'Sol' &&
                    move.categorie === 'Physique'
                )
            )
        })

        it('should return only certain amount of Moves with limit set', async () => {
            const response = await requestWithSupertest.get('/capacite/startsWith/B?limit=5')
            expect(response.status).to.equal(200)
            const moves = response.body
            expect(moves).to.be.an('array').that.is.lengthOf(5)
            expect(moves).to.satisfy(() =>
                moves.every(move => move.nom.startsWith('B'))
            )
        })
    })

    describe('• GET /capacite/ofPokemon/:id', () => {
        it('should return all moves from a pokemon', async() =>{
            const response = await requestWithSupertest.get('/capacite/ofPokemon/727')
            expect(response.status).to.equal(200)
            const moves = response.body
            expect(moves).to.be.an('array').that.is.not.empty
            expect(moves).to.satisfy(() =>
                moves.every(move => move.pokemons.includes('incineroar'))
            )
        })
        it('should return a error for invalid pokemon id' , async() =>{
            const response = await requestWithSupertest.get('/capacite/ofpokemon/-1')
            expect(response.status).to.equal(404)
            expect(response.body).to.deep.equal({message:'Pokemon Not Found'})
        })
    })
})