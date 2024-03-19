import React, { useState } from "react";

function PokemonCard({ id, nom, image, types, description }) {
    const [ouvert, setOuvert] = useState(false);

    const toggleElement = () => {
        setOuvert(!ouvert);
    };

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
                <button onClick={toggleElement}>{ouvert ? 'Fermer' : 'Déplier'}</button>
            </div>
            {ouvert && (
            <div className="pokemon-details">
                <span>Voici les détails supplémentaires...</span>
            </div>
            )}
        </div>


    );
}

export default PokemonCard;
