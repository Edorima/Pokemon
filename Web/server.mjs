import express from 'express';
import dotenv from 'dotenv'
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express()
const listeningPort = process.env.PORT

app.use(express.static('public'))

app.listen(listeningPort, () =>
    console.log(`PokéManager listening on port ${listeningPort}!`),
)

/**
 * @param page {string}
 * @returns {string}
 */
function getPage(page) {
    return path.join(__dirname, `/public/${page}.html`)
}

app.get('/', (req, res) => {
    return res.sendFile(getPage("home"))
})

