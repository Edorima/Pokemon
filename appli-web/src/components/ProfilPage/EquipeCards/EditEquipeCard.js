import {useCallback, useState} from "react"
import BoutonsAction from "./BoutonsAction"
import PokemonSelector from "../PokemonSelector"
import ObjetSelector from "../ObjetSelector"
import CapacitesSelector from "../CapacitesSelector"
import {PokemonProvider} from "../Contexts/PokemonContext"
import {ObjetProvider} from "../Contexts/ObjetContext"
import BoutonHeaderEquipeCard from "./BoutonHeaderEquipeCard"
import BoutonPokemon from "./BoutonPokemon"
import BoutonPokemonEmpty from "./BoutonPokemonEmpty"
import ApiManager from "../../ApiManager/ApiManager"

/**
 * @param initialNom {string}
 * @param initialPokemons {Object}
 * @param profil {Object}
 * @param setProfil {(Object) => void}
 * @param setEditingTeam {(value: number | null) => void}
 * @param added {boolean}
 */
export default function EditEquipeCard({
    initialNom,
    initialPokemons,
    profil,
    setProfil,
    setEditingTeam,
    added
}) {
    const [pokemons, setPokemons] = useState(initialPokemons)
    const [nom, setNom] = useState(initialNom)
    const [editingPkm, setEditingPkm] = useState(1)

    const editedPokemon = pokemons[`pokemon${editingPkm}`]

    const firstPlusButtonIndex = Object.values(pokemons)
        .findIndex(pokemon => pokemon === null)

    const nomsEquipeFiltre = useCallback(() => {
        return profil.equipes
            .map(e => e.nom)
            .filter(nom => nom !== initialNom)
    }, [profil.equipes, initialNom])

    const editPokemon = (index) => setEditingPkm(index + 1)

    const toggleShiny = (event) => {
        const updatedPokemons = {...pokemons}
        updatedPokemons[`pokemon${editingPkm}`].chromatique = event.target.checked
        setPokemons(updatedPokemons)
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

    /** @return string */
    const saveMessage = () => {
        if (!nom)
            return 'Le nom ne peut pas être vide.'

        if (nom.length > 32)
            return "Le nom de l'équipe ne doit pas faire plus de 32 caractères."

        if (nomsEquipeFiltre().includes(nom))
            return "Le nom de l'équipe est déjà pris."

        const message = 'Vous devez choisir au moins un Pokémon ' +
            'et au moins une capacité pour chacun de vos ' +
            'Pokémon pour pouvoir sauvegarder.'

        // On vérifie s'il y a au moins un Pokémon
        if (!pokemons.pokemon1)
            return message

        // On vérifie ensuite si tous les pokémons qui ne sont pas null ont au moins une capacité
        return Object.values(pokemons).every(pokemon => {
            /* Si le pokémon est null, on considère cela
            comme valide car on cherche des pokémons non null sans capacité */
            if (!pokemon) return true

            // Vérifier si le pokémon a au moins une des capacités non null
            return Object.values(pokemon.capacites)
                .some(capacite => capacite !== null)
        }) ? '' : message
    }

    const onSave = () => {
        const token = localStorage.getItem('token')
        const equipe = {nom: nom, pokemons: pokemons}
        if (added)
            ApiManager.addTeam(token, equipe).then()
        else
            ApiManager.editTeam(token, initialNom, pokemons, nom).then()

        setEditingTeam(null)
        // Mise à jour du profil avec les bon Pokémon
        const updatedProfil = {...profil}
        const updatedEquipeIndex = updatedProfil.equipes.findIndex(e => e.nom === initialNom)
        updatedProfil.equipes[updatedEquipeIndex] = equipe
        setProfil(updatedProfil)
    }

    const editTeamName = (event) => {
        const value = event.target.value
        if (value.length <= 32)
            setNom(value)
    }

    return (
        <div className="equipe">
            {!added && <h1 id='modeEdition'>Mode édition</h1>}
            <div className="headerEquipe">
                <textarea
                    className="nomEquipe"
                    maxLength='32'
                    defaultValue={nom}
                    spellCheck='false'
                    name='nomEquipe'
                    onChange={editTeamName}
                    rows='1'
                />

                <BoutonHeaderEquipeCard
                    className="boutonFavoris"
                    alt='Favoris'
                    src='/assets/equipeCardIcons/favorite.png'
                    onClick={() => {
                    }}
                />
            </div>

            <div className="pokemons">
                {Object.entries(pokemons).map(([key, pokemon], index) => (
                    pokemon ? (
                        <BoutonPokemon
                            key={`pokemon-${index}`}
                            focus={index + 1 === editingPkm}
                            onClick={() => editPokemon(index)}
                            pokemon={pokemon}
                        />
                    ) : (
                        <BoutonPokemonEmpty
                            key={`plus-${index}`}
                            focus={index+1 === editingPkm}
                            onClick={() => index === firstPlusButtonIndex && editPokemon(index)}
                            disabled={index !== firstPlusButtonIndex}
                            showPlus
                        />
                    )
                ))}
            </div>

            <div className="infoPokemon">
                <div className="choixPkm">
                    <PokemonProvider>
                        <PokemonSelector
                            pokemons={pokemons}
                            setPokemons={setPokemons}
                            editing={editingPkm}
                        />
                    </PokemonProvider>

                    <ObjetProvider>
                        <ObjetSelector
                            pokemons={pokemons}
                            setPokemons={setPokemons}
                            editing={editingPkm}
                        />
                    </ObjetProvider>

                    <label className="estChromatique">
                        <input
                            name='shiny'
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
                        Vous pouvez séléctionner des capacités
                        <CapacitesSelector
                            pokemons={pokemons}
                            setPokemons={setPokemons}
                            editing={editingPkm}
                        />
                    </div>
                }

                <div className="boutonsAction">
                    <BoutonsAction
                        saveMessage={saveMessage()}
                        onCancel={onCancel}
                        onSave={onSave}
                    />
                </div>
            </div>
        </div>
    )
}