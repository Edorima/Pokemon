import {useEffect, useState} from "react"
import ApiManager from "../ApiManager/ApiManager"

export default function PokemonSelector({
    pokemons,
    setPokemons,
    editing
}) {
    const [pokemonsList, setPokemonsList] = useState([])

    useEffect(() => {
        ApiManager.getPkms(0, 0)
            .then(response => response.json())
            .then(data => setPokemonsList(data))
    }, [])

    const selectPokemon = (event) => {
        const value = event.target.value

        // On trouve le pokémon correspondant
        const pkm = pokemonsList.find(
            p => p.nomNormalise === value
        )

        // On met à jour la liste
        const updatedPokemons = {...pokemons}
        updatedPokemons[`pokemon${editing}`] = {
            id: pkm.id, nom: pkm.nom,
            nomNormalise: pkm.nomNormalise,
            sprites: pkm.sprites,
            talents: pkm.talents,
            types: pkm.types,
            chromatique: false,
            objet: null,
            capacites: {
                capacite1: null,
                capacite2: null,
                capacite3: null,
                capacite4: null
            }
        }
        setPokemons(updatedPokemons)
    }

    const editedPokemon = pokemons[`pokemon${editing}`]

    return (
        <select
            className="choix"
            onChange={selectPokemon}
            value={editedPokemon?.nomNormalise || ''}>
            <option hidden>Choix du Pokémon</option>
            {pokemonsList.map((pokemon) => (
                <option key={pokemon.id} value={pokemon.nomNormalise}>
                    {pokemon.nom}
                </option>
            ))}
        </select>
    )
}