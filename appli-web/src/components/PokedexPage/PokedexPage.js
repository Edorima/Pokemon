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
        <div id="wrapper">
            <h1 id="title">Bienvenue sur le <strong>Pokédex</strong> !</h1>

            {/*Barre de recherche + choix de la catégorie*/}
            <div className="conteneur">
                <div className="rechercheConteneur">
                    {/*Barre de recherche*/}
                    <div className="barreRecherche">
                        <label form="champRecherche" hidden></label>
                        <input id="champRecherche" type="search" placeholder="Rechercher un Pokémon..."></input>
                        <button className="boutonRecherche">
                            <img src="/assets/search-normal.svg" alt="Loupe"></img>
                        </button>
                    </div>

                    {/*Choix de la catégorie*/}
                    <select className="choixGen">
                        <option hidden>Choix de la génération</option>
                        <option>All Gen</option>
                        <option>Gen 1</option>
                        <option>Gen 2</option>
                        <option>Gen 3</option>
                        <option>Gen 4</option>
                        <option>Gen 5</option>
                        <option>Gen 6</option>
                        <option>Gen 7</option>
                        <option>Gen 8</option>
                    </select>
                </div>
            </div>

            {/*Affichage des Pokémon selon la catégorie choisie*/}
            <div className="conteneur">
                {/*Affichage de liste des Pokémon*/}
                <div className="pokemonConteneur">
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
            </div>
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
