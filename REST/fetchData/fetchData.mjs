"use strict"

import { MongoClient } from 'mongodb'
import fetch from 'node-fetch'
import {HttpsProxyAgent} from 'https-proxy-agent'
import ConsoleProgressBar from 'console-progress-bar'
import fetchPokemons from "./fetchPokemons.mjs"
import fetchMoves from "./fetchMoves.mjs"
import fetchAbilities from "./fetchAbilities.mjs"
import fetchItems from "./fetchItems.mjs"

const proxy = process.env.https_proxy
const agent = proxy !== undefined ?
    new HttpsProxyAgent(proxy) :
    null

/**
 * Une fonction permettant d'obtenir des données
 * à partir d'une URL donnée.
 * @param url { string }
 * @returns {Promise<Object>}
 */
export async function fetchData(url) {
    const response = agent != null ?
        await fetch(url, {agent: agent}) :
        await fetch(url)
    return await response.json()
}

/**
 * Une fonction permettant de normaliser une chaîne
 * de caractère. Elle retire les accents et la mets
 * en minuscule.
 * @param str {string}
 * @returns {string}
 */
export function normalize(str) {
    return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
}


let dbUrl = 'mongodb://localhost:27017'
const client = new MongoClient(dbUrl)
const db = client.db("pokemanager")
export const pokemonCollection = db.collection('pokemon')
export const capaciteCollection = db.collection('capacite')
export const objetCollection = db.collection('objet')

console.log("Downloading data...")
export const progressBar = new ConsoleProgressBar({
    maxValue: 2531,
    startChars: '[', endChars: ']',
    filledPartChars: '=', notFilledPartChars: ' '
})

await fetchPokemons() // 898 pas
await fetchMoves() // 826 pas
await fetchAbilities() // 375 pas
await fetchItems() // 432 pas

console.log("Data downloaded.")

await client.close()