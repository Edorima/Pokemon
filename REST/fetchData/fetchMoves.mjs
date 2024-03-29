import Capacite from "../../Capacite/api/model/Capacite.mjs"
import {categorieMap, typeMap} from "./usefulData.mjs"
import {fetchData, normalize,
    progressBar, pokemonCollection, capaciteCollection
} from "./fetchData.mjs"

export default async function fetchMoves() {
    const capaciteURL = 'https://pokeapi.co/api/v2/move?limit=826'
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