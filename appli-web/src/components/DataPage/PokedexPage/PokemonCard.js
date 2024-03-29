import {useState} from "react"
import PokemonStats from "./PokemonStats"
import ApiManager from "../../ApiManager/ApiManager"

function PokemonTypes({types}) {
    // Vérifie le type de types qui est sensé être un array
    if (!Array.isArray(types)) {
        return null; // Permet d'éviter un crash en cas de mauvais fetch des données
    }
    return (
        <div className="pokemon-types">

            {types.map((type) =>
                <img
                    key={type}
                    src={`/assets/types/${type}.jpg`}
                    alt={type}
                    loading="lazy"
                />
            )}
        </div>
    )
}

export default function PokemonCard({pokemon}) {
    const [capacites, setCapacites] = useState([])
    const [ouvert, setOuvert] = useState(false)
    const toggleElement = async () => {
        if (capacites.length === 0)
            ApiManager.getMovesByPokemon(pokemon.id)
                .then(response => response.json())
                .then(data => setCapacites(data))
        setOuvert(!ouvert)
    }

    return (
        <div className="common-wrapper">
            <div className="card-display">
                <span className="pokemon-number">#{pokemon.id.toString().padStart(3, '0')}</span>
                <img
                    src={pokemon.sprites.default}
                    alt={pokemon.nom}
                    width='120'
                    height='120'
                    loading="lazy"
                />
                <div className="pokemon-info">
                    <span className="common-name">{pokemon.nom}</span>
                    <PokemonTypes types={pokemon.types}/>
                </div>
                <p className="pokemon-description">{pokemon.description}</p>
                <button onClick={toggleElement} className="details-button">
                    Détails
                    <img
                        className={ouvert ? 'rotated': ''}
                        src="/assets/arrow.svg"
                        alt={"flèche"}
                        loading="lazy"
                    />
                </button>

            </div>
            {ouvert && (
                <div className="pokemon-details-wrapper">
                    <div className="pokemon-information-details">
                        <div className="caracteristique" style={{paddingBottom: "18px"}}>
                            <p><strong>Espèce :</strong> {pokemon.espece}</p>
                            <p><strong>Taille :</strong> {pokemon.taille} m</p>
                            <p><strong>Poids :</strong> {pokemon.poids} kg</p>
                            <p><strong>Talents :</strong> {pokemon.talents.normaux.join(" / ")}</p>

                            {pokemon.talents.cache &&
                            <p><strong>Talent caché :</strong> {pokemon.talents.cache}</p>}
                        </div>

                        <div className="center">
                            <strong>Version Chromatique</strong><br/>
                            <img className="pokemon-sprite" src={pokemon.sprites.shiny} alt={`${pokemon.nom} Chromatique`}/>
                        </div>
                    </div>

                    <PokemonStats stats={pokemon.stats}/>

                    <div className='container-details border-detail' style={{overflowY: 'scroll'}}>

                        {capacites.map((capacite, index) => (
                                <div key={index} className='miniMoveDisplay'>
                                    <div className="ligne1">
                                    <strong className="capaciteName">{capacite.nom}</strong>
                                    <img
                                        src={`/assets/types/${capacite.type}.jpg` ?? '/assets/not_found.png'}
                                        alt={capacite.nom}
                                        loading="lazy"
                                    />

                                    <strong className="stat paddingLeftRight"> {capacite.puissance}</strong>
                                    <img
                                        src={`/assets/movesCategories/${capacite.categorie}.png`}
                                        alt={capacite.categorie}
                                    />
                                    <p className="stat otherstat"> {capacite.precision? capacite.precision + "%": "--%"}</p>
                                    <p className="stat otherstat2"> {capacite.pp}PP</p>


                                    </div>
                                    <p className="capacite-description">{capacite.description}</p>

                                </div>
                        ))}
                    </div>
            </div>
            )}
        </div>
    )
}