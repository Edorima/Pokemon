import { useState } from "react"
import BoutonsAction from "../BoutonsAction"
import PokemonSelector from "../PokemonSelector"
import ItemSelector from "../ItemSelector"
import CapacitesSelector from "../CapacitesSelector"
import ApiManager from "../../ApiManager/ApiManager"

/**
 * @param nom {string}
 * @param initialPokemons {Object}
 * @param profil {Object}
 * @param setProfil {(Object) => void}
 * @param setEditingTeam {(value: number | null) => void}
 * @param added {boolean}
 */
export default function EditEquipeCard({
    nom,
    initialPokemons,
    profil,
    setProfil,
    setEditingTeam,
    added
}) {
    const [pokemons, setPokemons] = useState(initialPokemons)
    const [editingPkm, setEditingPkm] = useState(1)

    const editedPokemon = pokemons[`pokemon${editingPkm}`]
    const firstPlusButtonIndex =
        Object.values(pokemons).findIndex(pokemon => pokemon === null)

    const editPokemon = (index) => setEditingPkm(index + 1)

    const toggleShiny = (event) => {
        const updatedPokemons = {...pokemons}
        updatedPokemons[`pokemon${editingPkm}`].chromatique = event.target.checked
        setPokemons(updatedPokemons)
    }

    const getSprite = (pokemon) => {
        return pokemon.chromatique ?
            pokemon.sprites.shiny :
            pokemon.sprites.default
    }

    const getPokemonClassName = (index) => {
        if (index+1 === editingPkm)
            return 'pokemon focus'
        return 'pokemon'
    }

    const deletePokemon = () => {
        const updatedPokemons = {...pokemons}
        for (let i = editingPkm; i <= 6; i++)
            updatedPokemons[`pokemon${i}`] = updatedPokemons[`pokemon${i + 1}`] || null
        setPokemons(updatedPokemons)
    }

    const onCancel = () => {
        if (added) {
            const updatedProfil = {...profil}
            updatedProfil.equipes =
                updatedProfil.equipes.filter(
                    e => e.nom !== nom
                )
            setProfil(updatedProfil)
        }
        setEditingTeam(null)
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
        setEditingTeam(null)

        // Mise à jour du profil avec les bon Pokémon
        setProfil(prevProfil => {
            const equipesMiseAJour = prevProfil.equipes.map(e => ({...e}))

            // Trouver l'index de l'équipe à mettre à jour
            const equipeIndex = equipesMiseAJour.findIndex(e => e.nom === equipe.nom)

            if (equipeIndex !== -1) {
                equipesMiseAJour[equipeIndex] = equipe
            } else
                equipesMiseAJour.push(equipe)

            return { ...prevProfil, equipes: equipesMiseAJour }
        })
    }

    return (
        <div className="equipe">
            <div className="headerEquipe">
                <span className="nomEquipe">{nom}</span>
                <button className='boutonFavoris'>
                    <img src='/assets/equipeCardIcons/favorite.png' alt='Favoris'/>
                </button>
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
                            <img
                                width="120" height="120"
                                src="/assets/plus.svg"
                                alt="Plus"
                                draggable="false"
                            />
                        </button>
                    )
                ))}
            </div>

            <div className="infoPokemon">
                <div className="choixPkm">
                    <PokemonSelector
                        pokemons={pokemons}
                        setPokemons={setPokemons}
                        editing={editingPkm}
                    />

                    <ItemSelector
                        pokemons={pokemons}
                        setPokemons={setPokemons}
                        editing={editingPkm}
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

                {editedPokemon &&
                    <div className="optionPkm">
                        <CapacitesSelector
                            pokemons={pokemons}
                            setPokemons={setPokemons}
                            editing={editingPkm}
                        />
                    </div>
                }

                <div className="boutonsAction">
                    <BoutonsAction
                        canSave={canSave()}
                        onCancel={onCancel}
                        onSave={onSave}
                    />
                </div>
            </div>
        </div>
    )
}