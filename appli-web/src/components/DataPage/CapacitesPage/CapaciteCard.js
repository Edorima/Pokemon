import {useState} from "react";

export default function CapaciteCard({capacity}) {
    const [ouvert, setOuvert] = useState(false)
    const toggleElement = () => setOuvert(!ouvert)

    return (
        <div className="common-wrapper">
            <div className="card-display">
                <div className="name-image">
                    <span className="common-name">{capacity.nom}</span>
                    <img
                        src={`/assets/types/${capacity.type}.jpg` ?? '/assets/not_found.png'}
                        alt={capacity.nom}
                        loading="lazy"
                    />

                </div>
                <p>{capacity.description}</p>
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
        </div>
    )
}