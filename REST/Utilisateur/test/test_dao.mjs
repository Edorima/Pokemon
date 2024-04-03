"use strict"

import mongoose from "mongoose";
import {MongoMemoryServer} from "mongodb-memory-server"

describe('UtilisateurDAO', () => {
    before(async () => {
        await mongoose.connection.close()
        const mongoServer = await MongoMemoryServer.create()
        const uri = mongoServer.getUri()
        await mongoose.connect(uri)
    })

    describe('• getUser', () => {
        // TODO
    })

    describe('• addUser', () => {
        // TODO
    })

    describe('• addTeam', () => {
        // TODO
    })

    describe('• editTeam', () => {
        // TODO
    })

    describe('• deleteTeam', () => {
        // TODO
    })
})