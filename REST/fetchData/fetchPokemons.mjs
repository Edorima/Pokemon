import Pokemon from "../api/model/Pokemon.mjs"
import {
    fetchData, normalize, typeMap,
    pokemonCollection, progressBar
} from "./fetchData.mjs"

const generationMap = new Map([
    ['generation-i', 1], ['generation-ii', 2],
    ['generation-iii', 3], ['generation-iv', 4],
    ['generation-v', 5], ['generation-vi', 6],
    ['generation-vii', 7], ['generation-viii', 8],
])

const pokemonsURL = 'https://pokeapi.co/api/v2/pokemon?limit=898'

/**
 * Une fonction pour télécharger les données concernant les Pokémon
 * et les mettre en base de données. Elle récupère les 898 premiers Pokémon
 * (de la 1ère à la 8ème génération).
 */
export default async function fetchPokemons() {
    const allPokemons = await fetchData(pokemonsURL)
    for (const pokemon of allPokemons.results) {
        progressBar.addValue()
        const pokemonData = await fetchData(pokemon.url)
        const pokemonSpecies = await fetchData(pokemonData.species.url)

        const nom = pokemonSpecies.names.find(
            name => name.language.name === 'fr'
        ).name

        const description = pokemonSpecies.flavor_text_entries.find(
            d => d.language.name === 'fr'
        ).flavor_text

        const espece = pokemonSpecies.genera.find(
            g => g.language.name === 'fr'
        ).genus

        const stats = pokemonData.stats.reduce((acc, stat) => {
            const key = stat.stat.name.replace('-', '_')
            acc[key] = stat.base_stat
            return acc
        }, {})

        const type1 = pokemonData.types[0]
        const type2 = pokemonData.types[1]

        const pokemonObject = new Pokemon({
            id: pokemonData.id,
            nom: nom,
            nomNormalise: normalize(nom),
            nomAnglais: pokemonData.name,
            sprites: {
                default: pokemonData.sprites.front_default,
                shiny: pokemonData.sprites.front_shiny
            },
            description: description,
            espece: espece,
            generation: generationMap.get(pokemonSpecies.generation.name),
            stats: stats,
            taille: Number.parseFloat(pokemonData.height) / 10,
            poids: Number.parseFloat(pokemonData.weight) / 10,
            capacites: [],
            talents: {normaux : [], cache: null},
            types: {
                type1: typeMap.get(type1.type.name),
                type2: type2 ? typeMap.get(type2.type.name) : null
            }
        })

        await pokemonCollection.updateOne(
            {id: pokemonData.id},
            {$set: pokemonObject},
            {upsert: true}
        )
    }

    await pokemonCollection.createIndex({nomNormalise: 1})
    await pokemonCollection.createIndex({nomAnglais: 1})
}