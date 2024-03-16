import React, {useEffect, useState} from 'react'
import PokemonCard from "./PokemonCard"
import ApiManager from "../ApiManager/ApiManager"

function normalizeString(str) {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
}

function PokedexPage() {
    const [pokemonList, setPokemonList] = useState([])
    const [gen, setGen] = useState(0)
    const [nom, setNom] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        ApiManager.getPokemons()
            .then(response => response.json())
            .then(data => {
                setPokemonList(data)
            })
            .catch(() => {
                setErrorMessage("Une erreur c'est produite. Veuillez réessayer.")
            })
    }, [])

    function handleAttacksClick(nameOrId) {
        // TODO Logique pour afficher la liste des attaques
    }

    function filterPokemons() {
        const filteredPokemons =
            gen === 0 ? pokemonList :
            pokemonList.filter(
                pkm => pkm.generation === gen
            )

        return searchTerm === '' ? filteredPokemons :
            filteredPokemons.filter(pkm =>
                pkm.nomNormalise.startsWith(normalizeString(searchTerm))
            )
    }

    const handleButtonClick = () => setSearchTerm(nom)
    const handleEnterPressed = (event) =>
        event.key === 'Enter' && setSearchTerm(nom)
    const handleInputChange = (event) => setNom(event.target.value)

    return (
        <div id="pokedexWrapper">
            <h1>Bienvenue sur le <strong>Pokédex</strong> !</h1>

            <div id="conteneurRecherche">
                <div id="recherche">

                    {/*Barre de recherche*/}
                    <div className="barreRecherche">
                        <input
                            id="champRecherche"
                            type="search"
                            placeholder="Rechercher un Pokémon..."
                            onChange={handleInputChange}
                            onKeyDown={handleEnterPressed}
                        ></input>
                        <button className="boutonRecherche" onClick={handleButtonClick}>
                            <img src="/assets/search-normal.svg" alt="Loupe"></img>
                        </button>
                    </div>

                    {/*Choix de la génération*/}
                    <select id="choixGen"
                            onChange={(e) => {setGen(Number.parseInt(e.target.value))}}>
                        <option value="0">Toutes les générations</option>
                        <option value="1">Génération 1</option>
                        <option value="2">Génération 2</option>
                        <option value="3">Génération 3</option>
                        <option value="4">Génération 4</option>
                        <option value="5">Génération 5</option>
                        <option value="6">Génération 6</option>
                        <option value="7">Génération 7</option>
                        <option value="8">Génération 8</option>
                    </select>

                    <select id="choixTri">
                        <option>Numéro de pokédex</option>
                    </select>
                </div>
            </div>

            <div id="error-message">{errorMessage}</div>

            {!errorMessage && <div className="pokemons">
                {/*Affichage de liste des Pokémon*/}
                {filterPokemons().map(pokemon => (
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
            </div>}
        </div>
    )
}

export default PokedexPage
