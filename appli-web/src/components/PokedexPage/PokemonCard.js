import React from "react";

function PokemonCard({ id, nom, image, types, description, onAttacksClick }) {
    return (
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
            <button onClick={onAttacksClick}>Liste des attaques</button>
        </div>
    )
}

export default PokemonCard