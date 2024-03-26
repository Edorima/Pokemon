import {useEffect, useState} from "react"
import ApiManager from "../ApiManager/ApiManager"

export default function ItemSelector({
    pokemons,
    setPokemons,
    editing
}) {
    const [itemsList, setItemsList] = useState([])

    useEffect(() => {
        ApiManager.getItems(0, 0)
            .then(response => response.json())
            .then(data => setItemsList(data))
    }, [])

    const selectItem = (event) => {
        const value = event.target.value
        const updatedPokemons = {...pokemons}

        if (value) {
            // On trouve l'objet correspondant
            const item = itemsList.find(i => i.nomNormalise === value)
            updatedPokemons[`pokemon${editing}`].objet = {
                nom: item.nom,
                nomNormalise: item.nomNormalise,
                sprite: item.sprite,
            }
        } else
            updatedPokemons[`pokemon${editing}`].objet = null

        // On met à jour la liste
        setPokemons(updatedPokemons)
    }

    const editedPokemon = pokemons[`pokemon${editing}`]

    return (
        <select
            className="choix"
            onChange={selectItem}
            value={editedPokemon?.objet?.nomNormalise || ''}
            disabled={!editedPokemon}>
            <option value="">Pas d'objet</option>
            {itemsList.map((item) => (
                <option key={item.nomNormalise} value={item.nomNormalise}>
                    {item.nom}
                </option>
            ))}
        </select>
    )
}