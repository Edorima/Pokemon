"use strict"

import { MongoClient } from 'mongodb'
import { createTunnel } from 'tunnel-ssh';
import fetch from 'node-fetch'
import {HttpsProxyAgent} from 'https-proxy-agent'
import Pokemon from "./api/model/Pokemon.mjs"
import ConsoleProgressBar from 'console-progress-bar'
import dotenv from 'dotenv'
import Capacite from "./api/model/Capacite.mjs";
dotenv.config()

const proxy = process.env.https_proxy
let agent = null
if (proxy !== undefined)
    agent = new HttpsProxyAgent(proxy)

/**
 *
 * @param url { string }
 * @returns {Promise<object>}
 */
async function fetchData(url) {
    let response = agent != null ? await fetch(url, { agent: agent }) : await fetch(url);
    return await response.json()
}

let dbUrl;
let server;
if (!agent && process.env.ENV === 'PROD') {
    [server, ] = await createTunnel(
        {autoClose: true},
        {port: null}, // Port automatiquement assigné par l'OS
        {
            host: '172.26.82.70',
            port: 22,
            username: 'tdmongo',
            password: 'tdmongo'
        },
        {
            dstAddr: '172.19.0.2',
            dstPort: 27017
        }
    )
    const address = server.address()
    const port = address.port
    console.log(`ssh tunnel listening on ${port}`)
    dbUrl = `mongodb://s4b14:s4b14@localhost:${port}/s4b14`
} else {
    dbUrl = 'mongodb://localhost:27017'
}

const client = new MongoClient(dbUrl)
const db = client.db("s4b14")

const pokemonCollection = db.collection('pokemon')
const capaciteCollection = db.collection('capacite')

const pokemonsURL = 'https://pokeapi.co/api/v2/pokemon?limit=898'
const capaciteURL = 'https://pokeapi.co/api/v2/move?limit=826'
const allPokemons = await fetchData(pokemonsURL)
const allMoves = await fetchData(capaciteURL)

console.log("Downloading data...")
const progressBar = new ConsoleProgressBar({
    maxValue: 1724,
    startChars: '[', endChars: ']',
    filledPartChars: '=', notFilledPartChars: ' '
})

const moves = []

for (const move of allMoves.results) {
    progressBar.addValue(1)
    const moveData = await fetchData(move.url)

    const moveObject = new Capacite({
        id: moveData.id,
        nom: moveData.names.find(
            name => name.language.name === 'fr'
        ).name,
        nomAnglais: moveData.name,
        description: moveData.flavor_text_entries.find(
            d => d.language.name === 'fr'
        ).flavor_text,
        categorie: moveData.damage_class,
        puissance: moveData.power,
        precision: moveData.accuracy,
        pp: moveData.pp,
        type: moveData.type
    })

    moves.push(moveObject)
    await capaciteCollection.updateOne(
        {id: moveData.id},
        {$set: moveObject},
        {upsert: true}
    )
}

for (const pokemon of allPokemons.results) {
    progressBar.addValue(1)
    const pokemonData = await fetchData(pokemon.url)
    const pokemonSpecies = await fetchData(pokemonData.species.url)

    let pkmMoves = pokemonData.moves
        .map(pkmMove => moves.find(move => move.nomAnglais === pkmMove.move.name))
        .filter(e => e !== undefined)
        .map(move => move.id)

    const pokemonObject = new Pokemon({
        id: pokemonData.id,
        nom: pokemonSpecies.names.filter(
            name => name.language.name === 'fr'
        )[0].name,
        nomAnglais: pokemonData.data,
        description: pokemonSpecies.flavor_text_entries.filter(
            d => d.language.name === 'fr'
        )[0].flavor_text,
        types: pokemonData.types,
        sprites: {
            front_default: pokemonData.sprites.front_default,
            front_shiny: pokemonData.sprites.front_shiny
        },
        cris: pokemonData.cries,
        stats: pokemonData.stats,
        taille: pokemonData.height,
        poids: pokemonData.weight,
        capacites: pkmMoves,
        talents: pokemonData.abilities
    })

    await pokemonCollection.updateOne(
        {id: pokemonData.id},
        {$set: pokemonObject},
        {upsert: true}
    )
}

console.log("Data downloaded.")

await client.close()
if (server) server.close()