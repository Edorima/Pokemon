"use strict"

import { MongoClient } from 'mongodb'
import { createTunnel } from 'tunnel-ssh';
import fetch from 'node-fetch'
import {HttpsProxyAgent} from 'https-proxy-agent'
import Pokemon from "./api/model/Pokemon.mjs"
import ConsoleProgressBar from 'console-progress-bar'
import Capacite from "./api/model/Capacite.mjs"
import { typeMap } from "./api/model/Type.mjs"

const proxy = process.env.https_proxy
let agent = null
if (proxy !== undefined)
    agent = new HttpsProxyAgent(proxy)

/**
 * @param url { string }
 * @returns {Promise<Object>}
 */
async function fetchData(url) {
    const response = agent != null ?
        await fetch(url, { agent: agent, headers: {'Content-Type': 'application/json'} }) :
        await fetch(url, {headers: {'Content-Type': 'application/json'}})
    return await response.json()
}

function normalizeString(str) {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
}

let dbUrl = 'mongodb://localhost:27017';
let server = null;
if (process.env.ENV === 'PROD') {
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
}

const client = new MongoClient(dbUrl)
const db = client.db("pokemanager")

const pokemonCollection = db.collection('pokemon')
const capaciteCollection = db.collection('capacite')
const typeCollection = db.collection('type')

console.log("Downloading data...")
const progressBar = new ConsoleProgressBar({
    maxValue: 1742,
    startChars: '[', endChars: ']',
    filledPartChars: '=', notFilledPartChars: ' '
})

/** @type {Map<string, string>} */
const categorieMap = new Map([
    ['physical', 'Physique'],
    ['special', 'Spéciale'],
    ['status', 'Statut']
])

const generationMap = new Map([
    ['generation-i', 1], ['generation-ii', 2],
    ['generation-iii', 3], ['generation-iv', 4],
    ['generation-v', 5], ['generation-vi', 6],
    ['generation-vii', 7], ['generation-viii', 8],
])

const capaciteURL = 'https://pokeapi.co/api/v2/move?limit=826'
const allMoves = await fetchData(capaciteURL)
/** @type {Map<string, Capacite>} */
const movesMap = new Map()

for (const move of allMoves.results) {
    progressBar.addValue()

    const moveData = await fetchData(move.url)
    const type = typeMap.get(moveData.type.name)
    const moveObject = new Capacite({
        id: moveData.id,
        nom: moveData.names.find(
            name => name.language.name === 'fr'
        ).name,
        nomAnglais: moveData.name,
        description: moveData.flavor_text_entries.find(
            d => d.language.name === 'fr'
        ).flavor_text,
        categorie: categorieMap.get(moveData.damage_class.name),
        puissance: moveData.power,
        precision: moveData.accuracy,
        pp: moveData.pp,
        type: type.nom
    })
    type.capacites.push(moveObject.nom)
    movesMap.set(moveData.name, moveObject)
    await capaciteCollection.updateOne(
        {id: moveData.id},
        {$set: moveObject},
        {upsert: true}
    )
}

const pokemonsURL = 'https://pokeapi.co/api/v2/pokemon?limit=898'
const allPokemons = await fetchData(pokemonsURL)

for (const pokemon of allPokemons.results) {
    progressBar.addValue()
    const pokemonData = await fetchData(pokemon.url)
    const pokemonSpecies = await fetchData(pokemonData.species.url)

    let pkmMoves = pokemonData.moves
        .map(pkmMove => movesMap.get(pkmMove.move.name))
        .filter(e => e !== undefined)
        .map(move => move.id)

    const nom = pokemonSpecies.names.find(
        name => name.language.name === 'fr'
    ).name

    const pokemonObject = new Pokemon({
        id: pokemonData.id,
        nom: nom,
        nomNormalise: normalizeString(nom),
        nomAnglais: pokemonData.name,
        sprites: {
            default: pokemonData.sprites.front_default,
            shiny: pokemonData.sprites.front_shiny
        },
        description: pokemonSpecies.flavor_text_entries.find(
            d => d.language.name === 'fr'
        ).flavor_text,
        generation: generationMap.get(pokemonSpecies.generation.name),
        stats: pokemonData.stats,
        taille: Number.parseFloat(pokemonData.height) / 10,
        poids: Number.parseFloat(pokemonData.weight) / 10,
        capacites: pkmMoves,
        talents: pokemonData.abilities
    })
    const types = []
    for (const type of pokemonData.types) {
        const typeObject = typeMap.get(type.type.name)
        typeObject.pokemons.push(pokemonObject.nom)
        types.push({slot: type.slot, type: typeObject.nom})
    }
    pokemonObject.types = types
    await pokemonCollection.updateOne(
        {id: pokemonData.id},
        {$set: pokemonObject},
        {upsert: true}
    )
}
await pokemonCollection.createIndex({nomNormalise: 1})

for (const type of typeMap.values()) {
    progressBar.addValue()
    await typeCollection.updateOne(
        {id: type.id},
        {$set: type},
        {upsert: true}
    )
}

console.log("Data downloaded.")

await client.close()
if (server) server.close()