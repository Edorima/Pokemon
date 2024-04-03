"use strict"

import {expect} from "chai"
import mongoose from "mongoose";
import {MongoMemoryServer} from "mongodb-memory-server"
import objetDAO from "../api/dao/objetDAO.mjs"
import objetsData from "./objetsData.mjs"

describe('ObjetDAO', () => {
    before(async () => {
        await mongoose.connection.close()
        const mongoServer = await MongoMemoryServer.create()
        const uri = mongoServer.getUri()
        await mongoose.connect(uri)
        await objetDAO.insertAll(await objetsData())
    })

    describe('• getItems', () => {
        it('should return Items', async () => {
            const items = await objetDAO.getItems()
            expect(items).to.be.an('array').that.is.not.empty

            const allKeys = new Set([
                'nom', 'nomAnglais', 'nomNormalise',
                'description', 'sprite', 'categorie'
            ])

            expect(items).to.satisfy(() =>
                items.every(item => {
                    const itemKeys = Object.keys(item)
                    return itemKeys.every(key => allKeys.has(key))
                })
            )
        })

        it('should return Items of specified category', async () => {
            const items = await objetDAO.getItems(5)
            expect(items).to.be.an('array').that.is.not.empty
            expect(items).to.satisfy(() =>
                items.every(item => item.categorie.id === 5)
            )
        })

        it("should return a limited number of Items when a limit is specified", async () => {
            const limit = 5
            const items = await objetDAO.getItems(
                undefined, limit
            )
            expect(items).to.be.an('array')
            expect(items.length).to.equal(limit)
        })

        it(`should return ${objetDAO.LIMIT} Pokemon when limit is errored`, async () => {
            const items = await objetDAO.getItems(
                undefined, NaN
            )
            expect(items).to.be.an('array').that.is.not.empty
            expect(items.length).to.equal(objetDAO.LIMIT)
        })
    })

    describe('• findItemsThatStartsWith', () => {
        it('should return Items whose names start with the specified term', async () => {
            const searchTerm = 'Baie'
            const items = await objetDAO.findItemsThatStartsWith(searchTerm)
            expect(items).to.be.an('array').that.is.not.empty
            expect(items).to.satisfy(() =>
                items.every(item => item.nom.startsWith(searchTerm))
            )
        })

        it('should return Items of specified term and category', async () => {
            const searchTerm = 'F'
            const idCategorie = 24
            const items = await objetDAO.findItemsThatStartsWith(searchTerm, idCategorie)
            expect(items).to.be.an('array').that.is.not.empty
            expect(items).to.satisfy(() =>
                items.every(item =>
                    item.nom.startsWith(searchTerm) &&
                    item.categorie.id === idCategorie
            ))
        })

        it(`should return ${objetDAO.LIMIT} Items when limit is errored`, async () => {
            const searchTerm = 'Baie'
            const items = await objetDAO.findItemsThatStartsWith(
                searchTerm, undefined, NaN
            )
            expect(items).to.be.an('array').that.is.lengthOf(objetDAO.LIMIT)
            expect(items).to.satisfy(() =>
                items.every(item => item.nom.startsWith(searchTerm))
            )
        })
    })
})