import React, {useEffect, useState} from 'react'
import PokemonCard from "./PokemonCard"
import ApiManager from "../ApiManager/ApiManager"
import "./PokedexPage.css"
import InfiniteScroll from "react-infinite-scroll-component";

const ELEMENT_PER_PAGE = 20
function normalizeString(str) {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
}

function PokedexPage() {
    const [dataList, setDataList] = useState([])

    const [pokemonList, setPokemonList] = useState([])
    const [pokemonListPage, setPokemonListPage] = useState(1)

    const [searchList, setSearchList] = useState([])
    const [searchListPage, setSearchListPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState('')

    const [hasMore, setHasMore] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')

    function fetchData(req, handleData) {
        setErrorMessage('')
        req
            .then(response => response.json())
            .then(data => {
                handleData(data)
                if (data.length !== ELEMENT_PER_PAGE)
                    setHasMore(false)
            })
            .catch(() =>
                setErrorMessage("Une erreur c'est produite. Veuillez réessayer.")
            )
    }

    function fetchPkms() {
        const handlePokemonList = (data) => {
            setPokemonList(pokemonList.concat(data))
            setDataList(dataList.concat(data))
            setPokemonListPage(pokemonListPage + 1)
        }

        fetchData(
            ApiManager.getPkms((pokemonListPage-1)*ELEMENT_PER_PAGE),
            handlePokemonList
        )
    }

    function fetchSearchedPkms() {
        const handleSearchList = (data) => {
            const newData = searchList.concat(data)
            setSearchList(newData)
            setDataList(newData)
            setSearchListPage(searchListPage + 1)
        }

        fetchData(
            ApiManager.getPkmsThatStartsWith(
                normalizeString(searchTerm),
                (searchListPage-1)*ELEMENT_PER_PAGE
            ),
            handleSearchList
        )
    }

    const handleInputChange = (event) => {
        const value = event.target.value
        setSearchTerm(value)
        if (value === '') {
            setSearchListPage(1)

            setDataList(pokemonList)
            setHasMore(true)
        }
    }

    useEffect(() => {
        fetchPkms()
    }, [])

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
                            onKeyDown={(e) => e.key === 'Enter' && fetchSearchedPkms()}
                            onChange={handleInputChange}
                        ></input>
                        <button className="boutonRecherche">
                            <img src="/assets/search-normal.svg" alt="Loupe"></img>
                        </button>
                    </div>

                    {/*Choix de la génération*/}
                    <select id="choixGen">
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
                        <option>Ordre alphabétique</option>
                    </select>

                </div>
            </div>

            <div id="error-message">{errorMessage}</div>

            <InfiniteScroll
                next={searchList.length === 0 ? fetchPkms : fetchSearchedPkms}
                hasMore={hasMore}
                loader={<p>Loading...</p>}
                dataLength={dataList.length}
            >
                {<div className="pokemons">
                    {/*Affichage de liste des Pokémon*/}
                    {dataList.map(pokemon => (
                        <PokemonCard
                            key={pokemon.id}
                            id={pokemon.id}
                            nom={pokemon.nom}
                            image={pokemon.image}
                            types={pokemon.types}
                            description={pokemon.description}
                        />
                    ))}
                </div>}
            </InfiniteScroll>
        </div>
    )
}

export default PokedexPage
