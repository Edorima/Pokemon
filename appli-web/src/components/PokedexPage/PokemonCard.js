import { useState } from "react"
import Stats from "./Stats";

function PokemonCard({ pokemon }) {
    const [ouvert, setOuvert] = useState(false)

    const toggleElement = () => {
        setOuvert(!ouvert)
    }

    return (
        <div className="pokemon-card-wrapper">
            <div className="pokemon-card">
                <span className="pokemon-number">#{pokemon.id.toString().padStart(3, '0')}</span>
                <img className="pokemon-sprite" src={pokemon.sprites.default} alt={pokemon.nom} />
                <div className="pokemon-info">
                    <span className="pokemon-name">{pokemon.nom}</span>
                    <div className="pokemon-types">
                        {pokemon.types.map(slot => (
                            <img
                                key={slot.type}
                                src={`/assets/types/${slot.type}.jpg`}
                                alt={slot.type}
                                loading="lazy">
                            </img>
                        ))}
                    </div>
                </div>
                <p className="pokemon-description">{pokemon.description}</p>
                <button onClick={toggleElement} className="details-button">{ouvert ? 'Fermer' : 'Détails'}</button>
            </div>
            {ouvert && (
            <div className="pokemon-details-wrapper">
                <div className="container-details" >
                    <div className="caracteristique" style={{paddingBottom: "18px"}}>
                        <p><strong>Espèce :</strong> {pokemon.espece}</p>
                        <p><strong>Taille :</strong> {pokemon.taille} m</p>
                        <p><strong>Poids :</strong> {pokemon.poids} kg</p>
                        <p><strong>Talents :</strong> {pokemon.talents.normaux.join(" / ")} </p>

                        {pokemon.talents.cache &&
                            <p> <strong>Talent caché :</strong> {pokemon.talents.cache}</p>
                        }
                    </div>
                    <div className="center">
                        <strong>Version Shiny</strong> <br/>
                        <img className="pokemon-sprite" src={pokemon.sprites.shiny} alt={`${pokemon.nom} Shiny`} />
                    </div>

                </div>
                <div className="container-details border-detail">
                    <Stats stats={pokemon.stats}/>
                </div>
                <div className="container-details border-detail">3</div>
            </div>
            )}
        </div>


    )
}

export default PokemonCard
