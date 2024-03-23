import {useCallback, useEffect, useState} from 'react'
import BarreRecherche from "../BarreRecherche"
import ErrorMessage from "../ErrorMessage"
import ItemList from "./ItemList"
import ApiManager, {ELEMENT_PER_PAGE} from "../ApiManager/ApiManager"
import './ItemsPage.css'

export default function ItemsPage() {
    const [items, setItems] = useState([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const fetchData = useCallback(async (req, reset) => {
        setErrorMessage('')
        try {
            const response = await req
            const data = await response.json()
            console.log(data)

            setItems(reset ? data : prevData => prevData.concat(data))
            setPage(reset ? 2 : prevPage => prevPage + 1)
            setHasMore(data.length === ELEMENT_PER_PAGE)
        } catch (_) {
            setErrorMessage("Une erreur c'est produite. Veuillez réessayer.")
        }
    }, [])

    const fetchItems = useCallback((reset = false) => {
        fetchData(
            ApiManager.getItems(
                reset ? 0 : (page-1)*ELEMENT_PER_PAGE
            ),
            reset
        ).then()
    }, [fetchData, page])

    const fetchSearchedItems = useCallback((reset = false) => {
        const normalizedST = searchTerm
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()

        fetchData(
            ApiManager.getItemsThatStartsWith(
                normalizedST,
                reset ? 0 : (page-1)*ELEMENT_PER_PAGE
            ), reset
        ).then()
    }, [fetchData, page, searchTerm])

    const handleSearchBarChange = (event) => {
        setHasMore(true)
        if (event.target.value === '')
            setSearchTerm('')
    }

    const handleSearchBarEnter = (event) => {
        if (event.key === 'Enter')
            setSearchTerm(event.target.value)
    }

    const getNextAction = () => {
        return searchTerm.length === 0 ?
            fetchItems : fetchSearchedItems
    }

    useEffect(() => {
        if (searchTerm !== '' && hasMore)
            fetchSearchedItems(true)
        else
            fetchItems(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm])

    return (
        <div id="objetsWrapper">
            <h1>Voici la liste des <strong>Objets</strong> !</h1>

            <div id="recherche">
                <BarreRecherche
                    handleOnChange={handleSearchBarChange}
                    handleKeyDown={handleSearchBarEnter}
                    placeholder="Rechercher un Objet..."
                />
            </div>

            <ErrorMessage error={errorMessage}/>

            <ItemList
                error={errorMessage}
                hasMore={hasMore}
                dataList={items}
                handleNextAction={getNextAction()}
                loader={<p>Loading...</p>}
            />
        </div>
    )
}