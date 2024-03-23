import './CapacitesPage.css'
import DataPage from "../DataPage";
import ItemList from "../ItemsPage/ItemList";
import ApiManager from "../../ApiManager/ApiManager";
import {useState} from "react";

export default function CapacitesPage() {
    const [category, setCategory] = useState(null)

    const getMoves = ({offset}) => ApiManager.getMoves(category, offset)
    const getSearchedMoves = ({searchTerm, offset}) =>
        ApiManager.getMovesThatStartsWith(searchTerm, category, offset)



    return (
        <DataPage
            wrapperId="objetsWrapper"
            pageTitle={<>Voici la liste des <strong>Capacité</strong> !</>}
            searchBarPlaceholder="Rechercher une capacité..."
            additionalControl={category}
            additionalState={category}
            getData={getMoves}
            getSearchedData={getSearchedMoves}
            renderList={ItemList}
        />
    )
}
