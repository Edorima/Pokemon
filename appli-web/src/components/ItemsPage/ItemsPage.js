import {useState} from 'react'
import './ItemsPage.css'
import ItemCard from "./ItemCard"

function normalizeString(str) {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
}

function ItemsPage() {
    const [itemList, setItemList] = useState([])
    const [categorie, setCategorie] = useState(0)
    const [nom, setNom] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    /*
    useEffect(() => {
        ApiManager.getItem()
            .then(response => response.json())
            .then(data => {
                setItemList(data)
            })
            .catch(() => {
                setErrorMessage("Une erreur c'est produite. Veuillez réessayer.")
            })
    }, [])*/

    function filterItems() {
        const filtereditems =
            categorie === 0 ? itemList :
                itemList.filter(
                    item => item.categorie === categorie
                )

        return searchTerm === '' ? filtereditems :
            filtereditems.filter(item =>
                item.nomNormalise.startsWith(normalizeString(searchTerm))
            )
    }

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
                            placeholder="Rechercher un Pokémon..."
                            onChange={handleInputChange}
                            onKeyDown={handleEnterPressed}
                        ></input>
                        <button className="boutonRecherche" onClick={handleButtonClick}>
                            <img src="/assets/search-normal.svg" alt="Loupe"></img>
                        </button>
                    </div>

                    {/*Choix de la catégorie*/}
                    <select id="choixGen"
                            onChange={(e) => {
                                setCategorie(Number.parseInt(e.target.value))
                            }}>
                        <option value="0">Choix de la catégorie</option>
                        <option value="1">Tout les objets</option>
                        <option value="2">Consomable</option>
                        <option value="3">Objet de combat</option>
                    </select>
                </div>
            </div>

            <div id="error-message">{errorMessage}</div>

            {!errorMessage && <div className="items">
                {/*Affichage de liste des items*/}
                {filterItems().map(item => (
                    <ItemCard
                        nom={item.name}
                        image={item.image}
                        description={item.description}
                    />
                ))}
            </div>}
        </div>
    )
}

export default ItemsPage
