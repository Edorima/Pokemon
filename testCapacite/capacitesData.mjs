import {dirname, join} from "path"
import {fileURLToPath} from "url"
import {readFileSync} from "fs"
import Capacite from "../api/model/Capacite.mjs"

export default async function capacitesData() {
    const __dirname = dirname(fileURLToPath(import.meta.url))
    const capacitesPath = join(__dirname, 'capacites.json')
    const rawCapacites = readFileSync(capacitesPath, 'utf8')
    /** @type Object[] */
    const parsedCapacites = JSON.parse(rawCapacites)
    return parsedCapacites.map(move => new Capacite(move))
}