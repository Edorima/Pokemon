import {useState} from "react"
import ApiManager from "../../ApiManager/ApiManager"

export default function CapaciteCard({move}) {
    const [pokemons, setPokemons] = useState([])
    const [ouvert, setOuvert] = useState(false)
    const toggleElement = async () => {
        if (pokemons.length === 0) {
            try {
                const response = await ApiManager.getPokemonsByMove(move.id)
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
                    <span className="common-name">{move.nom}</span>
                    <img

                        src={`/assets/types/${move.type}.jpg` ?? '/assets/not_found.png'}
                        alt={move.nom}
                        loading="lazy"
                    />

                </div>
                <span className="stat">
                    <img
                        src={`/assets/movesCategories/${move.categorie}.png`}
                        alt={move.categorie}
                    />
                    {move.puissance ?? '---'}
                </span>
                <p className="stat"> {move.precision? move.precision + "%": "--%"}</p>
                <p className="stat"> {move.pp}PP</p>
                <p className="capacite-description">{move.description}</p>

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