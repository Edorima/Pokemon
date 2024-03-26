import {useEffect, useState} from "react"
import {CapaciteViewer} from "./CapaciteViewer"
import ApiManager from "../ApiManager/ApiManager"

export default function CapacitesSelector({
  pokemons,
  setPokemons,
  editing
}) {
    const [movesList, setMovesList] = useState([])

    const editedPokemon = pokemons[`pokemon${editing}`]

    useEffect(() => {
        ApiManager.getMoves('', '',0)
            .then(response => response.json())
            .then(data => setMovesList(data))
    }, [])

    /**
     * Fonction pour obtenir les capacités disponibles pour un slot donné.
     * @param slot {number}
     * @return {Capacite[]}
     */
    const getAvailableMoves = (slot) => {
        // Récupérer les noms normalisés des capacités
        // déjà sélectionnées pour éviter les doublons.
        const selectedMoves = Object.values(editedPokemon?.capacites || {})
            .map(capacite => capacite?.nomNormalise)
            .filter(nomNormalise => nomNormalise)

        // Déterminer la capacité actuellement sélectionnée dans
        // le slot courant pour la réinclure dans les options disponibles.
        const currentMoveNomNormalise =
            editedPokemon?.capacites[`capacite${slot}`]?.nomNormalise

        // Filtrer la liste des capacités pour exclure
        // celles déjà sélectionnées, sauf la capacité actuelle du slot.
        return movesList.filter(move =>
            !selectedMoves.includes(move.nomNormalise)
            || move.nomNormalise === currentMoveNomNormalise
        )
    }

    const selectCapacite = (event, slot) => {
        const value = event.target.value
        const updatedPokemons = {...pokemons}

        if (value) {
            const move = movesList.find(m => m.nomNormalise === value)
            updatedPokemons[`pokemon${editing}`]
                .capacites[`capacite${slot}`] = {
                nom: move.nom, pp: move.pp,
                nomNormalise: move.nomNormalise,
                type: move.type
            }
        } else
            updatedPokemons[`pokemon${editing}`]
                .capacites[`capacite${slot}`] = null

        setPokemons(updatedPokemons)
    }

    function CapaciteSelector({slot, editedMove}) {
        return (
            <CapaciteViewer
                editedMove={editedMove}
                selector={
                    <select
                        className="choix"
                        onChange={(e) => selectCapacite(e, slot)}
                        value={editedMove?.nomNormalise || ''}>
                        <option value="">Aucune Attaque</option>
                        {getAvailableMoves(slot).map(m => (
                            <option key={m.id} value={m.nomNormalise}>
                                {m.nom}
                            </option>
                        ))}
                    </select>
                }
            />
        )
    }

    return (
        <div className="capacitesPkm">
            {[1, 2, 3, 4].map(slot => (
                <CapaciteSelector
                    key={slot}
                    slot={slot}
                    editedMove={editedPokemon?.capacites[`capacite${slot}`]}
                />
            ))}
        </div>
    )
}