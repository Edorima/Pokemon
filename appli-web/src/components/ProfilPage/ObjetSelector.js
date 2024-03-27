import {useObjet} from "./Contexts/ObjetContext"

export default function ObjetSelector({
    pokemons,
    setPokemons,
    editing
}) {
    const itemsList = useObjet()
    const editedPokemon = pokemons[`pokemon${editing}`]

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

    return (
        <select
            className="choix"
            onChange={selectItem}
            value={editedPokemon?.objet?.nomNormalise || ''}
            disabled={!editedPokemon}>
            <option value="">Pas d'objet</option>
            {itemsList.map((item) => (
                <option key={item.nomAnglais} value={item.nomNormalise}>
                    {item.nom}
                </option>
            ))}
        </select>
    )
}