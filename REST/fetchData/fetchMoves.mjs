import Capacite from "../api/model/Capacite.mjs"
import {
    fetchData, normalize, progressBar, typeMap,
    pokemonCollection, capaciteCollection
} from "./fetchData.mjs"

const categorieMap = new Map([
    ['physical', 'Physique'],
    ['special', 'Spéciale'],
    ['status', 'Statut']
])

export default async function fetchMoves(offset = 0) {
    const limit = 826
    if (offset >= limit) {
        progressBar.addValue(limit)
        return
    }
    progressBar.addValue(offset)
    const capaciteURL = `https://pokeapi.co/api/v2/move?limit=${limit-offset}&offset=${offset}`
    const allMoves = await fetchData(capaciteURL)
    for (const move of allMoves.results) {
        progressBar.addValue()
        const moveData = await fetchData(move.url)

        const nom = moveData.names.find(
            name => name.language.name === 'fr'
        ).name

        const learnedByPkms = moveData.learned_by_pokemon.map(p => p.name)

        const moveObject = new Capacite({
            id: moveData.id,
            nom: nom,
            nomNormalise: normalize(nom),
            nomAnglais: moveData.name,
            description: moveData.flavor_text_entries.find(
                d => d.language.name === 'fr'
            ).flavor_text,
            categorie: categorieMap.get(moveData.damage_class.name),
            puissance: moveData.power,
            precision: moveData.accuracy,
            pp: moveData.pp,
            type: typeMap.get(moveData.type.name),
            pokemons: learnedByPkms
        })

        await capaciteCollection.updateOne(
            {id: moveData.id},
            {$set: moveObject},
            {upsert: true}
        )

        await pokemonCollection.updateMany(
            {nomAnglais: {$in: learnedByPkms}},
            {$addToSet: {capacites: moveData.id}}
        )
    }
}