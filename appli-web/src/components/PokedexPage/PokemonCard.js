import React, { useState } from "react";

function PokemonCard({ id, nom, image, types, description, taille, poids, talents}) {
    const [ouvert, setOuvert] = useState(false);

    const toggleElement = () => {
        setOuvert(!ouvert);
    };

    const talent = () => {
        return (
            talents
                .filter(talent => !talent.is_hidden)
                .map((talent, index) => (
                    <span key={index}>
                    {' ' + talent.ability.name} {index !== talents.filter(talent => !talent.is_hidden).length - 1 && '/ '}
                </span>
                ))
        );
    }
    const talentCache = () => {
        return (
            talents
                .filter(talent => talent.is_hidden)
                .map((talent, index) => (
                    <span key={index}>
                    {' ' + talent.ability.name} {index !== talents.filter(talent => talent.is_hidden).length - 1 && '/ '}
                </span>
                ))
        );
    }



    return (

        <div className="pokemon-card-wrapper">
            <div className="pokemon-card">
                <span className="pokemon-number">#{id.toString().padStart(3, '0')}</span>
                <img className="pokemon-sprite" src={image} alt={nom} />
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
                        <p><strong>Espèce :</strong> Donnée manquante </p>
                        <p><strong>Taille :</strong> {taille} m </p>
                        <p><strong>Poids :</strong> {poids} kg  </p>
                        <p><strong>Talents :</strong> {talent()} </p>
                        <p> <strong>Talents :</strong> {talentCache()} </p>
                    </div>
                    <div className="center">
                        <strong> Version Shiny</strong> <br/>
                        <img className="pokemon-sprite" src={image} alt={nom} />

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


    );
}

export default PokemonCard;
