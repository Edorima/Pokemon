"use strict"

import {expect} from "chai"
import supertest from 'supertest'
import server from '../server.mjs'

const requestWithSupertest = supertest(server)

//Utilise l'environnement de TEST du serveur
describe('Objet Routes', () => {
    describe('• GET /objet', () => {
        it('should return Items', async () => {
            const response = await requestWithSupertest.get('/objet')
            expect(response.status).to.equal(200)
            expect(response.body).to.be.an('array').that.is.not.empty
        })

        it('should return Items with specified category', async () => {
            const response = await requestWithSupertest.get('/objet?categorie=23')
            expect(response.status).to.equal(200)
            const items = response.body
            expect(items).to.be.an('array').that.is.not.empty
            expect(items).to.satisfy(() =>
                items.every(item =>
                    item.categorie.id === 23 &&
                    item.categorie.nom === 'Soins de Statuts'
                )
            )
        })

        it('should return only certain amount of Item with limit set', async () => {
            const response = await requestWithSupertest.get('/objet?limit=5')
            expect(response.status).to.equal(200)
            expect(response.body).to.be.an('array').that.is.lengthOf(5)
        })
    })

    describe('• GET /objet/startsWith/:searchTerm', () => {
        it('should return Items matching searchTerm', async () => {
            const response = await requestWithSupertest.get('/objet/startsWith/Bonbon')
            expect(response.status).to.equal(200)
            const items = response.body
            expect(items).to.be.an('array').that.is.not.empty
            expect(items).to.satisfy(() =>
                items.every(item => item.nom.startsWith('Bonbon'))
            )
        })

        it('should return Items with matching searchTerm and of category 9', async () => {
            const response = await requestWithSupertest.get('/objet/startsWith/P?categorie=9')
            expect(response.status).to.equal(200)
            const items = response.body
            expect(items).to.be.an('array').that.is.not.empty
            expect(items).to.satisfy(() =>
                items.every(item =>
                    item.nom.startsWith('P') &&
                    item.categorie.id === 9
                ))
        })

        it('should return only certain amount of Item with limit set', async () => {
            const response = await requestWithSupertest.get('/objet/startsWith/B?limit=5')
            expect(response.status).to.equal(200)
            const items = response.body
            expect(items).to.be.an('array').that.is.lengthOf(5)
            expect(items).to.satisfy(() =>
                items.every(item => item.nom.startsWith('B'))
            )
        })
    })
})