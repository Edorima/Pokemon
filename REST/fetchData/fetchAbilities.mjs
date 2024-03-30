import {fetchData, progressBar, pokemonCollection} from "./fetchData.mjs"

/**
 * Une fonction pour télécharger les données concernant les talents
 * des Pokémon et leurs ajouter en base de données.
 */
export default async function fetchAbilities() {
    const talentsURL = 'https://pokeapi.co/api/v2/ability?limit=307'
    const allAbilities = await fetchData(talentsURL)
    for (const ability of allAbilities.results) {
        progressBar.addValue()
        const abilityData = await fetchData(ability.url)

        const nom = abilityData.names.find(
            a => a.language.name === 'fr'
        ).name

        // Tri les talents cache et normaux dans 2 listes distinctes
        const { hiddenAbility, normalAbility } = abilityData.pokemon.reduce((acc, a) => {
            if (a.is_hidden)
                acc.hiddenAbility.push(a)
            else
                acc.normalAbility.push(a)
            return acc
        }, { hiddenAbility: [], normalAbility: [] })

        // Liste les mises à jour
        const abilityUpdates = [
            {abilities: hiddenAbility, update: {$set: {"talents.cache": nom}}},
            {abilities: normalAbility, update: {$addToSet: {"talents.normaux": nom}}}
        ]

        // Mets à jour les pokémons pour leurs ajouter les talents
        for (const op of abilityUpdates) {
            await pokemonCollection.updateMany(
                {nomAnglais: {$in: op.abilities.map(a => a.pokemon.name)}},
                op.update
            )
        }
    }
}