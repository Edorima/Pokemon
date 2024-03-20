import React, {useEffect, useState} from 'react'
import ApiManager from "../ApiManager/ApiManager"
import "./PokedexPage.css"
import BarreRecherche from "./BarreRecherche"
import PokemonList from "./PokemonList"

const ELEMENT_PER_PAGE = 20

function PokedexPage() {
    const [pokemons, setPokemons] = useState([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [generation, setGeneration] = useState(null)
    const [sortAlphabetical, setSortAlphabetical] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const fetchData = async (req, reset) => {
        setErrorMessage('')
        try {
            const response = await req
            const data = await response.json()
            // TODO Trier les données
            if (reset) {
                setPokemons(data)
                setPage(2)
            } else {
                setPokemons(prev => [...prev, ...data])
                setPage(prevPage => prevPage + 1)
            }
            setHasMore(data.length === ELEMENT_PER_PAGE)
        } catch (error) {
            setErrorMessage("Une erreur c'est produite. Veuillez réessayer.")
        }
    }

    const fetchPkms = (reset = false) => {
        fetchData(
            ApiManager.getPkms(generation,
                reset ? 0 : (page-1)*ELEMENT_PER_PAGE
            ),
            reset
        )
    }

    const fetchSearchedPkms = (reset = false) => {
        const s = searchTerm.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()

        fetchData(
            ApiManager.getPkmsThatStartsWith(s, generation,
                reset ? 0 : (page-1)*ELEMENT_PER_PAGE
            ), reset
        )
    }

    const handleSearchBarChange = (event) => {
        setHasMore(true)
        if (event.target.value === '')
            setSearchTerm('')
    }

    const handleSearchBarEnter = (event) => {
        const value = event.target.value
        if (event.key === 'Enter')
            setSearchTerm(value)
    }

    const handleGenChoice = (event) => {
        const value = event.target.value
        setGeneration(value ? parseInt(value) : null)
    }

    const handleSort = (event) => {
        setSortAlphabetical(event.target.value)
    }

    const getNextAction = () => {
        return searchTerm.length === 0 ?
            fetchPkms : fetchSearchedPkms
    }

    useEffect(() => {
        if (searchTerm !== '' && hasMore)
            fetchSearchedPkms(true)
        else
            fetchPkms(true)
    }, [searchTerm, generation])

    return (
        <div id="pokedexWrapper">
            <h1>Bienvenue sur le <strong>Pokédex</strong> !</h1>

            <div id="conteneurRecherche">
                <div id="recherche">

                    {/*Barre de recherche*/}
                    <BarreRecherche
                        handleOnChange={handleSearchBarChange}
                        handleKeyDown={handleSearchBarEnter}
                    />

                    {/*Choix de la génération*/}
                    <select id="choixGen" onChange={handleGenChoice}>
                        <option value="">Toutes les générations</option>
                        <option value="1">Génération 1</option>
                        <option value="2">Génération 2</option>
                        <option value="3">Génération 3</option>
                        <option value="4">Génération 4</option>
                        <option value="5">Génération 5</option>
                        <option value="6">Génération 6</option>
                        <option value="7">Génération 7</option>
                        <option value="8">Génération 8</option>
                    </select>

                    <select id="choixTri" onChange={handleSort}>
                        <option value="">Numéro de pokédex</option>
                        <option value="1">Ordre alphabétique</option>
                    </select>

                </div>
            </div>

            {errorMessage && <div id="error-message">
                {errorMessage}
                <button onClick={getNextAction}>Réessayer</button>
            </div>}


            <PokemonList
                errorMessage={errorMessage}
                hasMore={hasMore}
                handleNextAction={getNextAction()}
                dataList={pokemons}
                loader={<p>Loading...</p>}
            />
        </div>
    )
}

export default PokedexPage
