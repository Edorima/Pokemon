import { useState } from "react"
import ApiManager from "../ApiManager/ApiManager"
import BoutonAction from "./BoutonAction";

// TODO TEMPORAIRE
const pokemonsList = []
ApiManager.getPkms(null, 0)
    .then(response => response.json())
    .then(data => pokemonsList.push(...data))

const itemsList = []
ApiManager.getItems(null, 0)
    .then(response => response.json())
    .then(data => itemsList.push(...data))

/**
 * @param nom {string}
 * @param initialPokemons {Object}
 */
export default function EquipeCard({nom, initialPokemons}) {
    const [pokemons, setPokemons] = useState(initialPokemons)
    const [editing, setEditing] = useState(1)

    const editedPokemon = pokemons[`pokemon${editing}`]
    const firstPlusButtonIndex =
        Object.values(pokemons).findIndex(pokemon => pokemon === null)

    const modifierPokemon = (index) => setEditing(index + 1)

    const selectPokemon = (event) => {
        const value = event.target.value

        // On trouve le pokémon correspondant
        const pkm = pokemonsList.find(
            p => p.nomNormalise === value
        )

        // Liste des clés du pokémon à garder
        const keysToKeep = [
            'id', 'nom', 'nomAnglais',
            'nomNormalise', 'sprites',
            'talents', 'types'
        ]

        // On ne garde que les clés voulu en y ajoutant d'autres caractéristiques
        const updatedPokemon = keysToKeep.reduce((acc, key) => {
            if (key in pkm)
                acc[key] = pkm[key]
            return acc
        }, {
            isShiny: false,
            objet: null,
            capacites: {
                capacite1: null,
                capacite2: null,
                capacite3: null,
                capacite4: null
            }
        })

        // On met à jour la liste
        const updatedPokemons = {...pokemons}
        updatedPokemons[`pokemon${editing}`] = updatedPokemon
        setPokemons(updatedPokemons)
    }

    const toggleShiny = (event) => {
        const updatedPokemons = {...pokemons}
        updatedPokemons[`pokemon${editing}`].isShiny = event.target.checked
        setPokemons(updatedPokemons)
    }

    const getSprite = (pokemon) => {
        return pokemon.isShiny ?
            pokemon.sprites.shiny :
            pokemon.sprites.default
    }

    const getPokemonClassName = (index) => {
        if (index+1 === editing)
            return 'pokemon editing'
        return 'pokemon'
    }

    const deletePokemon = () => {
        const updatedPokemons = {...pokemons}
        for (let i = editing; i <= 6; i++)
            updatedPokemons[`pokemon${i}`] = updatedPokemons[`pokemon${i + 1}`] || null
        setPokemons(updatedPokemons)
    }

    const canSave = () => {
        // On vérifie s'il y a au moins un Pokémon
        if (!pokemons.pokemon1)
            return false

        // On vérifie ensuite si tous les pokémons qui ne sont pas null ont au moins une capacité
        return Object.values(pokemons).every(pokemon => {
            /* Si le pokémon est null, on considère cela
            comme valide car on cherche des pokémons non null sans capacité */
            if (!pokemon) return true

            // Vérifier si le pokémon a au moins la capacite1 non null
            return !!pokemon.capacites.capacite1
        })
    }

    return (
        <div className="equipe">
            <div className="headerEquipe">
                <span className="nomEquipe">{nom}</span>
            </div>

            <div className="pokemons">
                {Object.entries(pokemons).map(([key, pokemon], index) => (
                    pokemon ? (
                        <button
                            key={`pokemon-${index}`}
                            className={getPokemonClassName(index)}
                            onClick={() => modifierPokemon(index)}>
                            <img src={getSprite(pokemon)} alt={pokemon.nom} width="100" height="100" draggable="false"/>
                        </button>
                    ) : (
                        <button
                            key={`plus-${index}`}
                            className={getPokemonClassName(index)}
                            onClick={() => index === firstPlusButtonIndex && modifierPokemon(index)}
                            disabled={index !== firstPlusButtonIndex}>
                            <img src="/assets/plus.svg" alt="Plus" draggable="false"/>
                        </button>
                    )
                ))}
            </div>

            <div className="parametragePokemon">
                <div className="choixPkm">
                    <select
                        onChange={selectPokemon}
                        value={editedPokemon?.nomNormalise || ''}
                    >
                        <option hidden>Choix du Pokémon</option>
                        {pokemonsList.map((pokemon) => (
                            <option key={pokemon.id} value={pokemon.nomNormalise}>
                                {pokemon.nom}
                            </option>
                        ))}
                    </select>

                    <label className="estChromatique">
                        <input
                            type="checkbox"
                            checked={editedPokemon?.isShiny || false}
                            onChange={(e) => editedPokemon && toggleShiny(e)}
                            disabled={!editedPokemon}
                        />
                        est chromatique ?
                    </label>

                    <button
                        onClick={() => editedPokemon && deletePokemon()}
                        disabled={!editedPokemon}>
                        Supprimer le pokémon
                    </button>
                </div>

                {editedPokemon && <><hr/>
                <div className="optionPkm">
                    <select>
                        <option value="">Pas d'objet</option>
                        {itemsList.map((item) => (
                            <option key={item.nomNormalise} value={item.nomNormalise}>
                                {item.nom}
                            </option>
                        ))}
                    </select>
                </div></>}

                <BoutonAction canSave={canSave()}/>
            </div>
        </div>
    )
}