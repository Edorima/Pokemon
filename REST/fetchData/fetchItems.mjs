import {categorieObjetMap} from "./usefulData.mjs"
import {fetchData, normalize, progressBar, objetCollection} from "./fetchData.mjs"

export default async function fetchItems() {
    const itemsURL = new Set()
    for (const category of categorieObjetMap.keys()) {
        const itemAttributeData = await fetchData(
            `https://pokeapi.co/api/v2/item-category/${category}`
        )
        const itemAttributeItems = itemAttributeData.items
        itemAttributeItems.forEach((item) => itemsURL.add(item.url))
    }

    for (const itemURL of itemsURL) {
        progressBar.addValue()
        const itemData = await fetchData(itemURL)

        const nom = itemData.names.find(
            n => n.language.name === 'fr'
        )?.name
        if (nom === undefined)
            continue

        const description = itemData.flavor_text_entries.find(
            d => d.language.name === 'fr'
        ).text

        const itemObject = {
            nom: nom,
            nomAnglais: itemData.name,
            nomNormalise: normalize(nom),
            description: description,
            sprite: itemData.sprites.default,
            categorie: categorieObjetMap.get(itemData.category.name)
        }

        await objetCollection.updateOne(
            {nomAnglais: itemData.name},
            {$set: itemObject},
            {upsert: true}
        )
    }
}