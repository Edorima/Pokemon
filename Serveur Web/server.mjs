import express from 'express';
import dotenv from 'dotenv'
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express()
const listeningPort = process.env.PORT || 8080

app.use(express.static(path.join(__dirname, 'public')))

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
});

app.listen(listeningPort, () =>
    console.log(`PokéManager listening on port ${listeningPort}!`),
)