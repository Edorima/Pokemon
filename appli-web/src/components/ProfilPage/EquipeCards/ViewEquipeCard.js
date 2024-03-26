import {useState} from "react"
import ItemSelector from "../ItemSelector"
import CapacitesSelector from "../CapacitesSelector"
import ApiManager from "../../ApiManager/ApiManager"
import BoutonsAction from "../BoutonsAction";
import {CapaciteViewer} from "../CapaciteViewer";

/**
 * @param nom {string}
 * @param initialPokemons {Object}
 * @param profil {Object}
 * @param setProfil {(Object) => void}
 */
export default function ViewEquipeCard({
   nom,
   pokemons,
   profil,
   setProfil
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

    const getSprite = (pokemon) => {
        return pokemon.chromatique ?
            pokemon.sprites.shiny :
            pokemon.sprites.default
    }

    const getPokemonClassName = (index) => {
        if (index+1 === viewPkm)
            return 'pokemon focus'
        return 'pokemon'
    }

    const closeView = () => setViewPkm(0)

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
                            onClick={() => viewPokemon(index)}>
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
                            key={`empty-${index}`}
                            className='pokemon'
                            disabled={index >= firstEmptyPokemonIndex}>
                        </button>
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