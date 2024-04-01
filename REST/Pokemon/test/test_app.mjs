"use strict"

import {expect} from "chai"
import supertest from 'supertest'
import server from '../server.mjs'

const requestWithSupertest = supertest(server)

//Utilise l'environnement de TEST du serveur
describe('Pokemon Routes', () => {
    describe('• GET /pokemon', () => {
        it('should return Pokemons', async () => {
            const response = await requestWithSupertest.get('/pokemon')
            expect(response.status).to.equal(200)
            expect(response.body).to.be.an('array').that.is.not.empty
        })

        it('should return Pokemons with type Normal', async () => {
            const response = await requestWithSupertest.get('/pokemon?type1=Normal')
            expect(response.status).to.equal(200)
            const body = response.body
            expect(body).to.be.an('array').that.is.not.empty
            expect(body).satisfy(pokemons =>
                pokemons.every(pokemon => pokemon.types.includes('Normal'))
            )
        })

        it('should return Pokemons with both types Normal and Fighting', async () => {
            const response = await requestWithSupertest.get('/pokemon?type1=Normal&type2=Combat')
            expect(response.status).to.equal(200)
            const body = response.body
            expect(body).to.be.an('array').that.is.not.empty
            expect(body).satisfy(pokemons =>
                pokemons.every(pokemon => pokemon.types.includes(...['Normal', 'Combat']))
            )
        })

        it('should return an error with type2 set and not type1', async () => {
            const response = await requestWithSupertest.get('/pokemon?type2=Normal')
            expect(response.status).to.equal(400)
            expect(response.body).to.be.deep.equal({message: 'type1 missing'})
        })

        it('should return Pokemons with invalid generation', async () => {
            const response = await requestWithSupertest.get('/pokemon?gen=Invalid')
            expect(response.status).to.equal(200)
            expect(response.body).to.be.an('array').that.is.not.empty
        })

        it('should return no Pokemon of generation 0', async () => {
            const response = await requestWithSupertest.get('/pokemon?gen=0')
            expect(response.status).to.equal(200)
            expect(response.body).to.be.an('array').that.is.empty
        })

        ;[1,5,8].forEach(gen => {
            it(`should return Pokemons of generation ${gen}`, async () => {
                const response = await requestWithSupertest.get(`/pokemon?gen=${gen}`)
                expect(response.status).to.equal(200)
                const body = response.body
                expect(body).to.be.an('array').that.is.not.empty
                expect(body).satisfy(pokemons =>
                    pokemons.every(pokemon => pokemon.generation === gen)
                )
            })
        })

        it('should return only certain amount of Pokemon with limit set', async () => {
            const response = await requestWithSupertest.get('/pokemon?limit=5')
            expect(response.status).to.equal(200)
            expect(response.body).to.be.an('array').that.is.lengthOf(5)
        })

        it('should return Pokemons skipped by a specified offset', async () => {
            const response = await requestWithSupertest.get('/pokemon?offset=5')
            expect(response.status).to.equal(200)
            const body = response.body
            expect(body).to.be.an('array').that.is.not.empty

            let expectedId = 6
            expect(body).satisfy(pokemons =>
                pokemons.every(pokemon => pokemon.id === expectedId++)
            )
        })
    })

    describe('• GET /pokemon/:id', () => {
        it('should return a Pokemon', async () => {
            const response = await requestWithSupertest.get('/pokemon/1')
            expect(response.status).to.equal(200)
            const pokemon = response.body
            expect(pokemon).to.be.an('object')
            expect(pokemon).to.satisfy(() =>
                pokemon.id === 1 &&
                pokemon.nom === 'Bulbizarre'
            )
        })

        it("should not found a Pokemon whose id doesn't exist", async () => {
            const response = await requestWithSupertest.get('/pokemon/-1')
            expect(response.status).to.equal(404)
            expect(response.body).to.deep.equal({message: 'Not Found'})
        })

        it('should not found a Pokemon with invalid id', async () => {
            const response = await requestWithSupertest.get('/pokemon/Invalid')
            expect(response.status).to.equal(404)
            expect(response.body).to.deep.equal({message: 'Not Found'})
        })
    })

    describe('• GET /pokemon/startsWith/:searchTerm', () => {
        it('should return Pokemons matching searchTerm', async () => {
            const response = await requestWithSupertest.get('/pokemon/startsWith/Car')
            expect(response.status).to.equal(200)
            const body = response.body
            expect(body).to.be.an('array').that.is.not.empty
            expect(body).satisfy(pokemons =>
                pokemons.every(pokemon => pokemon.nom.startsWith('Car'))
            )
        })

        it('should return Pokemons with matching searchTerm and with type Fairy', async () => {
            const response = await requestWithSupertest.get('/pokemon/startsWith/D?type1=Fée')
            expect(response.status).to.equal(200)
            const body = response.body
            expect(body).to.be.an('array').that.is.not.empty
            expect(body).satisfy(pokemons =>
                pokemons.every(pokemon =>
                    pokemon.nom.startsWith('D') &&
                    pokemon.types.includes('Fée')
            ))
        })

        it('should return Pokemons with matching searchTerm and both types Steel and Dragon', async () => {
            const response = await requestWithSupertest.get('/pokemon/startsWith/D?type1=Dragon&type2=Acier')
            expect(response.status).to.equal(200)
            const body = response.body
            expect(body).to.be.an('array').that.is.not.empty
            expect(body).to.satisfy(pokemons =>
                pokemons.every(pokemon =>
                    pokemon.nom.startsWith('D') &&
                    pokemon.types.includes(...['Dragon', 'Acier'])
            ))
        })

        it('should return an error with type2 set and not type1', async () => {
            const response = await requestWithSupertest.get('/pokemon/startsWith/Pikachu?type2=Électrik')
            expect(response.status).to.equal(400)
            expect(response.body).to.be.deep.equal({message: 'type1 missing'})
        })

        it('should return Pokemons with invalid generation', async () => {
            const response = await requestWithSupertest.get('/pokemon/startsWith/P?gen=Invalid')
            expect(response.status).to.equal(200)
            const body = response.body
            expect(body).to.be.an('array').that.is.not.empty
            expect(body).to.satisfy(pokemons =>
                pokemons.every(pokemon => pokemon.nom.startsWith('P'))
            )
        })

        it('should return no Pokemon of generation 0', async () => {
            const response = await requestWithSupertest.get('/pokemon/startsWith/R?gen=0')
            expect(response.status).to.equal(200)
            expect(response.body).to.be.an('array').that.is.empty
        })

        ;[1,5,8].forEach(gen => {
            it(`should return Pokemons of generation ${gen}`, async () => {
                const response = await requestWithSupertest.get(`/pokemon/startsWith/A?gen=${gen}`)
                expect(response.status).to.equal(200)
                const body = response.body
                expect(body).to.be.an('array').that.is.not.empty
                expect(body).satisfy(pokemons =>
                    pokemons.every(pokemon =>
                        pokemon.nom.startsWith('A') &&
                        pokemon.generation === gen
                ))
            })
        })

        it('should return only certain amount of Pokemon with limit set', async () => {
            const response = await requestWithSupertest.get('/pokemon/startsWith/B?limit=5')
            expect(response.status).to.equal(200)
            const body = response.body
            expect(body).to.be.an('array').that.is.lengthOf(5)
            expect(body).to.satisfy(pokemons =>
                pokemons.every(pokemon => pokemon.nom.startsWith('B'))
            )
        })
    })

    describe('• GET /pokemon/withMove/:id', () => {
        it('should return Pokemons that can learn the move', async () => {
            const response = await requestWithSupertest.get('/pokemon/withMove/1')
            expect(response.status).to.equal(200)
            const body = response.body
            expect(body).to.be.an('array').that.is.not.empty
            expect(body).to.satisfy(pokemons =>
                pokemons.every(pokemon => pokemon.capacites.includes(1))
            )
        })

        it('should return not found for invalid move id', async () => {
            const response = await requestWithSupertest.get('/pokemon/withMove/-1')
            expect(response.status).to.equal(404)
            expect(response.body).to.deep.equal({message: 'Move Not Found'})
        })
    })
})
