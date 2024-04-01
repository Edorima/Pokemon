import {dirname, join} from "path"
import {fileURLToPath} from "url"
import {readFileSync} from "fs"
import mongoose from "mongoose"
import {MongoMemoryServer} from "mongodb-memory-server"
import Capacite from "../api/model/Capacite.mjs";

export default async function createTestDbAndPopulate() {
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
}