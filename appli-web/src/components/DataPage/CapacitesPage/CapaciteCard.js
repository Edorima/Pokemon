import {useEffect, useState} from "react"
import ApiManager from "../../ApiManager/ApiManager"

export default function CapaciteCard({capacity}) {
    const [pokemons, setPokemons] = useState([])
    const [ouvert, setOuvert] = useState(false)
    const toggleElement = async () => {
        if (pokemons.length === 0) {
            try {
                const response = await ApiManager.getPokemonsByMove(capacity.id)
                const data = await response.json()
                setPokemons(data)
            } catch (_) {

            }
        }
        setOuvert(!ouvert)
    }

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
                <p className="stat"> {capacity.puissance}</p>

                <p className="stat"> {capacity.precision? capacity.precision + "%": "--%"}</p>
                <p className="stat"> {capacity.pp}PP</p>
                <p className="capacite-description">{capacity.description}</p>

                <div>
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
            {ouvert && (
                <div>
                    {pokemons.map(p =>
                        <img
                            key={p.id}
                            src={p.sprites.default}
                            alt={p.name}
                            loading="lazy"
                        />
                    )}
                </div>
            )}
        </div>
    )
}