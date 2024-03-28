import {useState} from "react"
import ItemList from "./ItemList"
import DataPage from "../DataPage"
import SelectCategorieObjet from "./SelectCategorieObjet"
import ApiManager from "../../ApiManager/ApiManager"
import './ItemsPage.css'

export default function ItemsPage() {
    const [category, setCategory] = useState(0)

    const getItems = ({offset}) => ApiManager.getItems(category, offset)
    const getSearchedItems = ({searchTerm, offset}) =>
        ApiManager.getItemsThatStartsWith(searchTerm, category, offset)

    const handleCategoryChoice = (event) => {
        const value = event.target.value
        setCategory(value ? parseInt(value) : null)
    }

    return (
        <DataPage
            wrapperId="objetsWrapper"
            pageTitle={<>Voici la liste des <strong>Objets</strong> !</>}
            searchBarPlaceholder="Rechercher un Objet..."
            additionalControls={[<SelectCategorieObjet key={'categorie'} onChange={handleCategoryChoice}/>]}
            additionalStates={[category]}
            getData={getItems}
            getSearchedData={getSearchedItems}
            renderList={ItemList}
        />
    )
}