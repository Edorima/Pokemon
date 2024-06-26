import {categorieMap, typeMap} from "./usefulData.mjs"
import {fetchData, normalize, Pokemon, Capacite, progressBar} from "./fetchData.mjs"

export default async function fetchMoves() {
    const capaciteURL = 'https://pokeapi.co/api/v2/move?limit=826'
    const allMoves = await fetchData(capaciteURL)
    for (const move of allMoves.results) {
        const moveData = await fetchData(move.url)

        const nom = moveData.names.find(
            name => name.language.name === 'fr'
        ).name

        const learnedByPkms = moveData.learned_by_pokemon.map(p => p.name)

        const moveObject = {
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
        }

        await Capacite.updateOne(
            {id: moveData.id},
            {$set: moveObject},
            {upsert: true}
        )

        await Pokemon.updateMany(
            {nomAnglais: {$in: learnedByPkms}},
            {$addToSet: {capacites: moveData.id}}
        )
        progressBar.addValue()
    }
}