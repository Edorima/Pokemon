import {dirname, join} from "path"
import {fileURLToPath} from "url"
import {readFileSync} from "fs"
import Objet from "../api/model/Objet.mjs"

export default async function objetsData() {
    const __dirname = dirname(fileURLToPath(import.meta.url))
    const itemsPath = join(__dirname, 'objets.json')
    const rawItems = readFileSync(itemsPath, 'utf8')
    /** @type Object[] */
    const parsedItems = JSON.parse(rawItems)
    return parsedItems.map(item => new Objet(item))
}