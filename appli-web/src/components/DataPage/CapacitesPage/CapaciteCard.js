import {useState} from "react"
import ApiManager from "../../ApiManager/ApiManager"

export default function CapaciteCard({move}) {
    const [pokemons, setPokemons] = useState([])
    const [ouvert, setOuvert] = useState(false)
    const toggleElement = () => {
        if (pokemons.length === 0)
            ApiManager.getPokemonsByMove(move.id)
                .then(response => response.json())
                .then(data => setPokemons(data))
        setOuvert(!ouvert)
    }

    return (
        <div className="common-wrapper">
            <div className="card-display">
                <div className="name-image">
                    <span className="common-name">{move.nom}</span>
                    <img
                        src={`/assets/types/${move.type}.jpg`}
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

                <p className="stat"> {move.precision ?? "---"}%</p>
                <p className="stat"> {move.pp}PP</p>
                <p className="capacite-description">{move.description}</p>

                <button onClick={toggleElement} className="details-button">
                    Détails
                    <img
                        className={ouvert ? 'rotated' : ''}
                        src="/assets/arrow.svg"
                        alt={"flèche"}
                        loading="lazy"
                    />
                </button>
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