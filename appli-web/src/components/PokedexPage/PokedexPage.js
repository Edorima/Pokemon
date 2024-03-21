import {useCallback, useEffect, useState} from 'react'
import BarreRecherche from "./BarreRecherche"
import PokemonList from "./PokemonList"
import SelectGeneration from "./SelectGeneration"
import ErrorMessage from "../ErrorMessage"
import ApiManager from "../ApiManager/ApiManager"
import "./PokedexPage.css"

const ELEMENT_PER_PAGE = 20

function PokedexPage() {
    const [pokemons, setPokemons] = useState([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [generation, setGeneration] = useState(null)
    const [errorMessage, setErrorMessage] = useState('')

    const fetchData = useCallback(async (req, reset) => {
        setErrorMessage('')
        try {
            const response = await req
            const data = await response.json()

            setPokemons(reset ? data : prevData => prevData.concat(data))
            setPage(reset ? 2 : prevPage => prevPage + 1)
            setHasMore(data.length === ELEMENT_PER_PAGE)
        } catch (_) {
            setErrorMessage("Une erreur c'est produite. Veuillez réessayer.")
        }
    }, [])

    const fetchPkms = useCallback((reset = false) => {
        fetchData(
            ApiManager.getPkms(generation,
                reset ? 0 : (page-1)*ELEMENT_PER_PAGE
            ),
            reset
        ).then()
    }, [fetchData, generation, page])

    const fetchSearchedPkms = useCallback((reset = false) => {
        const normalizedST = searchTerm
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()

        fetchData(
            ApiManager.getPkmsThatStartsWith(
                normalizedST, generation,
                reset ? 0 : (page-1)*ELEMENT_PER_PAGE
            ), reset
        ).then()
    }, [fetchData, generation, page, searchTerm])

    const handleSearchBarChange = (event) => {
        setHasMore(true)
        const value = event.target.value.replace(/ /g, '')
        event.target.value = value
        if (value === '')
            setSearchTerm('')
    }

    const handleSearchBarEnter = (event) => {
        const value = event.target.value
        if (event.key === 'Enter')
            setSearchTerm(value)
    }

    const handleGenChoice = (event) => {
        const value = event.target.value
        setHasMore(true)
        setGeneration(value ? parseInt(value) : null)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, generation])

    return (
        <div id="pokedexWrapper">
            <h1>Bienvenue sur le <strong>Pokédex</strong> !</h1>

            <div id="recherche">

                <BarreRecherche
                    handleOnChange={handleSearchBarChange}
                    handleKeyDown={handleSearchBarEnter}
                />

                <SelectGeneration onChange={handleGenChoice}/>
            </div>

            <ErrorMessage error={errorMessage}/>

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
