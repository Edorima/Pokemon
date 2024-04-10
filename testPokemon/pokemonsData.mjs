import {dirname, join} from "path"
import {fileURLToPath} from "url"
import {readFileSync} from "fs"
import Pokemon from "../api/model/Pokemon.mjs"

export default async function pokemonsData() {
    const __dirname = dirname(fileURLToPath(import.meta.url))
    const pokemonsPath = join(__dirname, 'pokemons.json')
    const rawPokemons = readFileSync(pokemonsPath, 'utf8')
    /** @type Object[] */
    const parsedPokemons = JSON.parse(rawPokemons)
    return parsedPokemons.map(pkm => new Pokemon(pkm))
}