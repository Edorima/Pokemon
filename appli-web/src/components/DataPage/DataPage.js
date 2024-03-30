import React, {useCallback, useEffect, useState} from "react"
import ErrorMessage from "../ErrorMessage"

const ELEMENT_PER_PAGE = 20

function BarreRecherche({
    placeholder,
    handleOnChange,
    handleKeyDown
}) {
    return (
        <div className="barreRecherche">
            <input
                id="champRecherche"
                type="search"
                placeholder={placeholder}
                onKeyDown={handleKeyDown}
                onChange={handleOnChange}
                size={placeholder.length}
            />
            <img src="/assets/search-normal.svg" alt="Loupe"/>
        </div>
    )
}

export default function DataPage({
    wrapperId,
    pageTitle,
    searchBarPlaceholder,
    additionalControls = [],
    additionalStates = [],
    getData,
    getSearchedData,
    renderList,
}) {
    const [data, setData] = useState([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const fetchData = useCallback(async (req, reset) => {
        setErrorMessage('')
        try {
            const response = await req
            const data = await response.json()
            setData(reset ? data : prevData => prevData.concat(data))
            setPage(reset ? 2 : prevPage => prevPage + 1)
            setHasMore(data.length === ELEMENT_PER_PAGE)
        } catch (_) {
            setErrorMessage("Une erreur c'est produite. Veuillez réessayer.")
        }
    }, [])

    const fetchNormalData = useCallback((reset = false) => {
        console.log("ici")
        fetchData(
            getData({offset: reset ? 0 : (page-1)*ELEMENT_PER_PAGE}),
            reset
        ).then()
    }, [fetchData, page, ...additionalStates])

    const fetchSearchedData = useCallback((reset = false) => {
        const normalizedST = searchTerm
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()

        fetchData(
            getSearchedData({
                searchTerm : normalizedST,
                offset: reset ? 0 : (page-1)*ELEMENT_PER_PAGE
            }), reset
        ).then()
    }, [fetchData, page, searchTerm, ...additionalStates])

    const handleSearchBarChange = (event) => {
        if (event.target.value === '')
            setSearchTerm('')
    }

    const handleSearchBarEnter = (event) => {
        if (event.key === 'Enter')
            setSearchTerm(event.target.value)
    }

    const getNextAction = () => {
        return searchTerm.length === 0 ?
            fetchNormalData : fetchSearchedData
    }

    useEffect(() => {
        if (searchTerm !== '')
            fetchSearchedData(true)
        else
            fetchNormalData(true)
    }, [searchTerm, ...additionalStates])

    return (
        <div id={wrapperId}>
            <h1>{pageTitle}</h1>

            <div id="recherche">
                <BarreRecherche
                    handleOnChange={handleSearchBarChange}
                    handleKeyDown={handleSearchBarEnter}
                    placeholder={searchBarPlaceholder}
                />

                {additionalControls}
            </div>

            <ErrorMessage error={errorMessage}/>

            {renderList({
                error: errorMessage,
                hasMore: hasMore,
                dataList: data,
                handleNextAction: getNextAction(),
                loader: <p>Loading...</p>
            })}
        </div>
    )
}