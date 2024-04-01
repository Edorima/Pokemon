"use strict"

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import {dirname, join} from "path"
import {fileURLToPath} from "url"
import {readFileSync} from "fs"
import Capacite from "./api/model/Capacite.mjs"

dotenv.config()

const serverPort = process.env.PORT || 8082
const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017'
const mongoDB = process.env.MONGO_DB || 'pokemanager'
const env = process.env.ENV || 'PROD'

const {default: app}  = await import ('./app.mjs')

// Lancement du serveur
const server = app.listen(serverPort, () =>
    console.log(`Capacité service on port ${serverPort}`)
)

console.log(`ENV : ${env}`)

if (env === 'TEST') {
    const __dirname = dirname(fileURLToPath(import.meta.url))
    const capacitesPath = join(__dirname, 'capacites.json')
    const rawCapacites = readFileSync(capacitesPath, 'utf8')
    const capacitesData = JSON.parse(rawCapacites).map(({ _id, ...rest }) => rest)
    await mongoose.connection.close()
    const {MongoMemoryServer} = await import("mongodb-memory-server")
    const mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    await mongoose.connect(uri)
    await Capacite.insertMany(capacitesData, null)
} else {
    const uri = mongoURL + '/' + mongoDB
    await mongoose.connect(uri)
    console.log(`MongoDB on ${uri}`)
}

//Pour les interruptions utilisateur
for (let signal of ["SIGTERM", "SIGINT"])
    process.on(signal,  () => {
        console.info(`${signal} signal received.`)
        console.log("Closing http server.");
        server.close(async (err) => {
            console.log("Http server closed.")
            process.exit(err ? 1 : 0)
        })
    })

export default server