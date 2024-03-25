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

const capaciteURL = 'https://pokeapi.co/api/v2/move?limit=826'

export default async function fetchMoves() {

    const allMoves = await fetchData(capaciteURL)
    for (const move of allMoves.results) {
        progressBar.addValue()
        const moveData = await fetchData(move.url)

        const nom = moveData.names.find(
            name => name.language.name === 'fr'
        ).name

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
            type: typeMap.get(moveData.type.name)
        })

        await capaciteCollection.updateOne(
            {id: moveData.id},
            {$set: moveObject},
            {upsert: true}
        )

        const learnedByPkms = moveData.learned_by_pokemon.map(p => p.name)
        await pokemonCollection.updateMany(
            {nomAnglais: {$in: learnedByPkms}},
            {$addToSet: {capacites: moveData.id}}
        )
    }
}