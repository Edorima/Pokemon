import React, {useEffect, useState} from 'react'
import './PokedexPage.css'
import ApiManager from "../ApiManager/ApiManager"

function PokedexPage() {
    const [pokemonList, setPokemonList] = useState([])
    const [page, setPage] = useState(1)

    useEffect(() => {
        ApiManager.getPokemons(page)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                // Ici, ajoutez les données de l'API à la liste existante
                setPokemonList(data)
                // Vous pouvez également gérer la fin de la liste si l'API indique qu'il n'y a plus de données
            })
    }, [page])

    function handleAttacksClick(nameOrId) {
        // Logique pour afficher la liste des attaques
    }

    return (
        <div>
            <h1>Bienvenue sur le Pokédex !</h1>
            {pokemonList.map(pokemon => (
                <PokemonCard
                    key={pokemon.id}
                    id={pokemon.id}
                    nom={pokemon.nom}
                    image={pokemon.image}
                    types={pokemon.types}
                    description={pokemon.description}
                    onAttacksClick={() => handleAttacksClick(pokemon.id)}
                />
            ))}
            <button onClick={() => setPage(prevPage => prevPage + 1)}>Charger plus</button>
        </div>
    )
}

function PokemonCard({ id, nom, image, types, description, onAttacksClick }) {
    return (
        <div className="pokemon-card">
            <div className="pokemon-number">#{id.toString().padStart(3, '0')}</div>
            <img src={image} alt={nom} />
            <h2>{nom}</h2>
            <div className="pokemon-types">
                {types.map(slot => (
                    <img src={`/assets/types/${slot.type}.jpg`} alt={slot.type}></img>
                ))}
            </div>
            <p>{description}</p>
            <button onClick={onAttacksClick}>Liste des attaques</button>
        </div>
    )
}

export default PokedexPage;
