import {useEffect, useState} from 'react'
import './ItemsPage.css'
import ItemCard from "./ItemCard"
import ApiManager from "../ApiManager/ApiManager";

function normalizeString(str) {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
}

function ItemsPage() {
    const [itemList, setItemList] = useState([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [nom, setNom] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const handleButtonClick = () => setSearchTerm(nom)
    const handleEnterPressed = (event) =>
        event.key === 'Enter' && setSearchTerm(nom)

    function handleInputChange(event) {
        const value = event.target.value
        if (value === '') setSearchTerm('')
        setNom(value)
    }

    return (
        <div id="objetsWrapper">
            <h1>Voici la liste des <strong>Objets</strong> !</h1>

            <div id="conteneurRecherche">
                <div id="recherche">

                    {/*Barre de recherche*/}
                    <div className="barreRecherche">
                        <input
                            id="champRecherche"
                            type="search"
                            placeholder="Rechercher un Objet..."
                            onChange={handleInputChange}
                            onKeyDown={handleEnterPressed}
                        ></input>
                        <button className="boutonRecherche" onClick={handleButtonClick}>
                            <img src="/assets/search-normal.svg" alt="Loupe"></img>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ItemsPage
