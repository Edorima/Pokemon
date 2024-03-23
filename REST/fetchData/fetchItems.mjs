import Objet from "../api/model/Objet.mjs"
import {
    fetchData, normalize,
    progressBar, objetCollection
} from "./fetchData.mjs"

const baseURL = "https://pokeapi.co/api/v2/item-"


export default async function fetchItems() {
    const itemsURL = new Set()
    const itemAttributeIds = [
        'attribute/consumable', 'attribute/usable-in-battle',
        'attribute/holdable', 'attribute/holdable-active',
        'category/mega-stones', 'category/held-items'
    ]
    for (const id of itemAttributeIds) {
        const itemAttributeData = await fetchData(baseURL + id)
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

        const itemObject = new Objet({
            nom: nom,
            nomAnglais: itemData.name,
            nomNormalise: normalize(nom),
            description: description,
            sprite: itemData.sprites.default
        })

        await objetCollection.updateOne(
            {nomAnglais: itemData.name},
            {$set: itemObject},
            {upsert: true}
        )
    }
}