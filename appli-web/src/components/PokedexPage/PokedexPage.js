import React, {useCallback, useEffect, useState} from 'react'
import ApiManager from "../ApiManager/ApiManager"
import "./PokedexPage.css"
import BarreRecherche from "./BarreRecherche"
import PokemonsList from "./PokemonsList"

const ELEMENT_PER_PAGE = 20

function PokedexPage() {
    const [dataList, setDataList] = useState([])

    const [pokemonList, setPokemonList] = useState([])
    const [pokemonListPage, setPokemonListPage] = useState(1)

    const [filterList, setFilterList] = useState([])
    const [filterListPage, setFilterListPage] = useState(1)
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

    const fetchPkms = useCallback(() => {

        const handlePokemonList = (data) => {
            setPokemonList(prevList => prevList.concat(data))
            setDataList(prevList => prevList.concat(data))
            setPokemonListPage(prevPage => prevPage + 1)
        }

        fetchData(
            ApiManager.getPkms((pokemonListPage-1)*ELEMENT_PER_PAGE),
            handlePokemonList
        )
    }, [pokemonListPage])

    function fetchSearchedPkms() {
        console.log("Fetching")
        const handleSearchList = (data) => {
            const newData = filterList.concat(data)
            setFilterList(newData)
            setDataList(newData)
            setFilterListPage(filterListPage + 1)
        }

        fetchData(
            ApiManager.getPkmsThatStartsWith(
                searchTerm.normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase(),
                (filterListPage-1)*ELEMENT_PER_PAGE
            ),
            handleSearchList
        )
    }

    const handleInputChange = (event) => {
        const value = event.target.value
        if (value === '') {
            setDataList(pokemonList)
            setHasMore(true)
        }
        setFilterListPage(1)
        setFilterList([])
        setSearchTerm(value)
    }

    const handleNextAction = () =>
        filterList.length === 0 ?
            fetchPkms() : fetchSearchedPkms()

    useEffect(() => {
        fetchPkms()
    }, [fetchPkms])

    return (
        <div id="pokedexWrapper">
            <h1>Bienvenue sur le <strong>Pokédex</strong> !</h1>

            <div id="conteneurRecherche">
                <div id="recherche">

                    {/*Barre de recherche*/}
                    <BarreRecherche
                        handleInputChange={handleInputChange}
                        fetchSearchedPkms={fetchSearchedPkms}
                    />

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

            {errorMessage && <div id="error-message">
                {errorMessage}
                <button onClick={handleNextAction}>Réessayer</button>
            </div>}


            <PokemonsList
                errorMessage={errorMessage}
                hasMore={hasMore}
                handleNextAction={handleNextAction}
                dataList={dataList}
                loader={<p>Loading...</p>}
            />
        </div>
    )
}

export default PokedexPage
