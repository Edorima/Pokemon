import {dirname, join} from "path"
import {fileURLToPath} from "url"
import {readFileSync} from "fs"
import mongoose from "mongoose"
import {MongoMemoryServer} from "mongodb-memory-server"
import Pokemon from "../api/model/Pokemon.mjs"

export default async function createTestDbAndPopulate() {
    const __dirname = dirname(fileURLToPath(import.meta.url))
    const pokemonsPath = join(__dirname, 'pokemons.json')
    const rawPokemons = readFileSync(pokemonsPath, 'utf8')
    const pokemonsData = JSON.parse(rawPokemons).map(({ _id, ...rest }) => rest)
    await mongoose.connection.close()
    const mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    await mongoose.connect(uri)
    await Pokemon.insertMany(pokemonsData, null)
}