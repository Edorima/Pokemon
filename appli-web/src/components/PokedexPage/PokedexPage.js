import React, {useEffect, useState} from 'react'
import PokemonCard from "./PokemonCard"
import './PokedexPage.css'
import ApiManager from "../ApiManager/ApiManager"

const ELEMENT_PER_PAGE = 20

function PokedexPage() {
    const [pokemonList, setPokemonList] = useState([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)

    useEffect(() => {
        if (hasMore) {
            ApiManager.getPokemons(page)
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    setPokemonList(prevPokemonList => [...prevPokemonList, ...data])
                    if (data.length !== ELEMENT_PER_PAGE) {
                        setHasMore(false)
                    }
                })
        }
    }, [hasMore, page])

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
            <div className="pokemons">
                {/*Affichage de liste des Pokémon*/}
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
                {hasMore && <button onClick={() => setPage(prevPage => prevPage + 1)}>Charger plus</button>}
            </div>
        </div>
    )
}

export default PokedexPage
