import { useState } from "react"
import BoutonsAction from "./BoutonsAction"
import PokemonSelector from "./PokemonSelector"
import ItemSelector from "./ItemSelector"
import CapacitesSelector from "./CapacitesSelector"
import ApiManager from "../ApiManager/ApiManager"

/**
 * @param nom {string}
 * @param initialPokemons {Object}
 * @param profil {Object}
 * @param setProfil {(Object) => void}
 */
export default function EquipeCard({
    nom,
    initialPokemons,
    profil,
    setProfil
}) {
    const [pokemons, setPokemons] = useState(initialPokemons)
    const [editing, setEditing] = useState(1)

    const editedPokemon = pokemons[`pokemon${editing}`]
    const firstPlusButtonIndex =
        Object.values(pokemons).findIndex(pokemon => pokemon === null)

    const editPokemon = (index) => setEditing(index + 1)

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

    const onCancel = () => {
        const updatedProfil = {...profil}
        updatedProfil.equipes =
            updatedProfil.equipes.filter(
                e => e.nom !== nom
            )
        setProfil(updatedProfil)
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

            // Vérifier si le pokémon a au moins une des capacités non null
            return Object.values(pokemon.capacites)
                .some(capacite => capacite !== null)
        })
    }

    const onSave = () => {
        const token = localStorage.getItem('token')
        const equipe = {nom: nom, pokemons: pokemons}
        ApiManager.addTeam(token, equipe).then()
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
                            onClick={() => editPokemon(index)}>
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
                            onClick={() => index === firstPlusButtonIndex && editPokemon(index)}
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
                        Supprimer le Pokémon
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

                        <div className="separator"/>

                        <CapacitesSelector
                            pokemons={pokemons}
                            setPokemons={setPokemons}
                            editing={editing}
                        />
                    </div>
                </>}

                <BoutonsAction
                    canSave={canSave()}
                    onCancel={onCancel}
                    onSave={onSave}
                />
            </div>
        </div>
    )
}