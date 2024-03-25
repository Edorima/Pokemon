import { useState } from "react"
import BoutonsAction from "./BoutonsAction"
import PokemonSelector from "./PokemonSelector"
import ItemSelector from "./ItemSelector"

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

    const toggleShiny = (event) => {
        const updatedPokemons = {...pokemons}
        updatedPokemons[`pokemon${editing}`].chromatique = event.target.checked
        setPokemons(updatedPokemons)
    }

    const getSprite = (pokemon) => {
        return pokemon.chromatique ?
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
                            <img
                                src={getSprite(pokemon)}
                                alt={pokemon.nom}
                                width="120" height="120"
                                draggable="false"
                            />
                            {pokemon.objet &&
                            <img
                                className="item-sprite"
                                src={pokemon.objet.sprite ?? '/assets/not_found.png'}
                                width="50" height="50"
                                alt={pokemon.objet.nom}
                                draggable="false"
                            />}
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
                    <PokemonSelector
                        pokemons={pokemons}
                        setPokemons={setPokemons}
                        editing={editing}
                    />

                    <label className="estChromatique">
                        <input
                            type="checkbox"
                            checked={editedPokemon?.chromatique || false}
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

                {editedPokemon && <>
                    <hr/>
                    <div className="optionPkm">
                        <ItemSelector
                            pokemons={pokemons}
                            setPokemons={setPokemons}
                            editing={editing}
                        />

                        {/* TODO Ajouter les capacités */}
                    </div>
                </>}

                <BoutonsAction canSave={canSave()}/>
            </div>
        </div>
    )
}