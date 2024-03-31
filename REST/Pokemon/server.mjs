"use strict"

import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const serverPort = process.env.PORT || 8081
const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017'
const mongoDB = process.env.MONGO_DB || 'pokemanager'
const env = process.env.ENV || 'PROD'

const {default: app}  = await import ('./app.mjs')

// Lancement du serveur
const server = app.listen(serverPort, () =>
    console.log(`App listening on port ${serverPort}`)
)

if (env === 'TEST') {
    const {MongoMemoryServer}  = await import('mongodb-memory-server')
    const mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    await mongoose.connect(uri)
} else {
    const uri = mongoURL + '/' + mongoDB
    await mongoose.connect(uri)
    console.log(`MongoDB on ${uri}`)
}

//Pour les interrucptions utilisateur
for (let signal of ["SIGTERM", "SIGINT"])
    process.on(signal,  () => {
        console.info(`${signal} signal received.`)
        console.log("Closing http server.");
        server.close(async (err) => {
            console.log("Http server closed.")
            process.exit(err ? 1 : 0)
        })
    })