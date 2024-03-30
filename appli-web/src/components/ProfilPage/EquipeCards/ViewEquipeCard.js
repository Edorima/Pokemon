import {useState} from "react"
import {CapaciteViewer} from "../CapaciteViewer"
import BoutonHeaderEquipeCard from "./BoutonHeaderEquipeCard"
import BoutonPokemon from "./BoutonPokemon"
import BoutonPokemonEmpty from "./BoutonPokemonEmpty"
import ApiManager from "../../ApiManager/ApiManager"

/**
 * @param nom {string}
 * @param pokemons {Object}
 * @param profil {Object}
 * @param setProfil {(Object) => void}
 * @param setEditingTeam {(value: number | null) => void}
 * @param changeDisabled {boolean}
 * @param setAdded {(boolean) => void}
 */
export default function ViewEquipeCard({
   nom,
   pokemons,
   profil,
   setProfil,
   setEditingTeam,
   changeDisabled,
   setAdded
}) {
    const [viewPkm, setViewPkm] = useState(0)

    const viewedPkm = pokemons[`pokemon${viewPkm}`]
    const firstEmptyPokemonIndex =
        Object.values(pokemons).findIndex(pokemon => pokemon === null)

    const viewPokemon = (index) => {
        const clickedPkm = index + 1
        if (clickedPkm === viewPkm)
            setViewPkm(0)
        else
            setViewPkm(clickedPkm)
    }

    const closeView = () => setViewPkm(0)

    const editTeam = () => {
        const teamIndex = profil.equipes.findIndex((e) => e.nom === nom)
        setEditingTeam(teamIndex)
        setAdded(false)
    }

    const deleteTeam = () => {
        const token = localStorage.getItem('token')
        ApiManager.deleteTeam(token, nom).then()
        setEditingTeam(null)
        const updatedProfil = {...profil}
        updatedProfil.equipes = updatedProfil.equipes.filter(
            e => e.nom !== nom
        )
        setProfil(updatedProfil)
    }

    return (
        <div className="equipe">
            <div className="headerEquipe">
                <span className="nomEquipe">{nom}</span>
                <span className='boutonsHeader'>
                    <BoutonHeaderEquipeCard
                        className='boutonModifier'
                        disabled={changeDisabled}
                        onClick={editTeam}
                        src='/assets/equipeCardIcons/edit.svg'
                        alt='Modifier'
                    />

                    <BoutonHeaderEquipeCard
                        className='boutonFavoris'
                        disabled={changeDisabled}
                        onClick={() => {}}
                        src='/assets/equipeCardIcons/favorite.png'
                        alt='Favoris'
                    />

                    <BoutonHeaderEquipeCard
                        className='boutonSupprimer'
                        disabled={changeDisabled}
                        onClick={deleteTeam}
                        src='/assets/equipeCardIcons/delete.png'
                        alt='Supprimer'
                    />
                </span>
            </div>

            <div className="pokemons">
                {Object.entries(pokemons).map(([key, pokemon], index) => (
                    pokemon ? (
                        <BoutonPokemon
                            key={`pokemon-${index}`}
                            focus={index+1 === viewPkm}
                            onClick={() => viewPokemon(index)}
                            pokemon={pokemon}
                        />
                    ) : (
                        <BoutonPokemonEmpty
                            key={`empty-${index}`}
                            disabled={index >= firstEmptyPokemonIndex}
                        />
                    )
                ))}
            </div>

            {viewedPkm &&
                <div className="infoPokemon">
                    <div className="choixPkm">
                        {viewedPkm.nom}{viewedPkm.chromatique ? ' (chromatique)' : ''}<br/>
                        {viewedPkm.objet ? `Objet : ${viewedPkm.objet.nom}` : "Pas d'objet"}
                    </div>

                    <div className="capacitesPkm">
                        {[1, 2, 3, 4].map(slot => (
                            <CapaciteViewer
                                key={slot}
                                slot={slot}
                                editedMove={viewedPkm?.capacites[`capacite${slot}`]}
                            />
                        ))}
                    </div>

                    <div className="boutonsAction">
                        <button onClick={closeView}>Fermer</button>
                    </div>
                </div>
            }
        </div>
    )
}