import { useState } from "react"

function PokemonCard({ id, nom, sprites, types, description, taille, poids, talents}) {
    const [ouvert, setOuvert] = useState(false)

    const toggleElement = () => {
        setOuvert(!ouvert)
    }

    const talentCache = talents.find(t => t.is_hidden)?.ability.name

    return (
        <div className="pokemon-card-wrapper">
            <div className="pokemon-card">
                <span className="pokemon-number">#{id.toString().padStart(3, '0')}</span>
                <img className="pokemon-sprite" src={sprites.default} alt={nom} />
                <div className="pokemon-info">
                    <span className="pokemon-name">{nom}</span>
                    <div className="pokemon-types">
                        {types.map(slot => (
                            <img
                                key={slot.type}
                                src={`/assets/types/${slot.type}.jpg`}
                                alt={slot.type}
                                loading="lazy">
                            </img>
                        ))}
                    </div>
                </div>
                <p className="pokemon-description">{description}</p>
                <button onClick={toggleElement} className="details-button">{ouvert ? 'Fermer' : 'Détails'}</button>
            </div>
            {ouvert && (
            <div className="pokemon-details-wrapper">
                <div className="container-details" >
                    <div className="caracteristique" style={{paddingBottom: "18px"}}>
                        <p><strong>Espèce :</strong> Donnée manquante</p>
                        <p><strong>Taille :</strong> {taille} m</p>
                        <p><strong>Poids :</strong> {poids} kg</p>
                        <p><strong>Talents :</strong> {
                            talents.filter(t => !t.is_hidden)
                                .map(t => t.ability.name)
                                .join(" / ")
                        } </p>

                        {talentCache &&
                            <p> <strong>Talent caché :</strong> {talentCache}</p>
                        }
                    </div>
                    <div className="center">
                        <strong>Version Shiny</strong> <br/>
                        <img className="pokemon-sprite" src={sprites.shiny} alt={`${nom} Shiny`} />

                    </div>

                </div>
                <div className="container-details border-detail center">
                    <strong> Statistiques </strong>
                    <div className="statistique">
                        <span> Statistique</span>
                    </div>
                </div>
                <div className="container-details border-detail">3</div>
            </div>
            )}
        </div>


    )
}

export default PokemonCard
