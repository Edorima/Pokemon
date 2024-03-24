import './CapacitesPage.css'
import DataPage from "../DataPage";

import ApiManager from "../../ApiManager/ApiManager";
import {useState} from "react";
import CapacitesList from "./CapacitesList";
import SelectData from "../SelectData";

function SelectType({onChange}) {
    const map = new Map([
        [1, "Normal"], [2, "Combat"],
        [3, "Vol"], [4, "Poison"], [5, "Sol"],
        [6, "Roche"], [7, "Insecte"],
        [8, "Spectre"], [9, "Acier"], [10, "Feu"],
        [11, "Eau"], [12, "Plante"], [13, "Électrik"],
        [14, "Psy"], [15, "Glace"], [16, "Dragon"],
        [17, "Ténèbres"]
    ])
    return (
        <SelectData
            onChange={onChange}
            defaultOptionText="Tous les types">
            {[...map].map(([key, value]) => (
                <option key={key} value={value}>{value}</option>
            ))}
        </SelectData>
    )
}


export default function CapacitesPage() {
    const [type, setType] = useState(null)

    const getMoves = ({offset}) => ApiManager.getMoves(type, offset)
    const getSearchedMoves = ({searchTerm, offset}) =>
        ApiManager.getMovesThatStartsWith(searchTerm, type, offset)
    const handleCategoryChoice = (event) => {
        const value = event.target.value
        setType(value ? value : null)
    }


    return (
        <DataPage
            wrapperId="objetsWrapper"
            pageTitle={<>Voici la liste des <strong>Capacité</strong> !</>}
            searchBarPlaceholder="Rechercher une capacité..."
            additionalControl={<SelectType onChange={handleCategoryChoice}/>}
            additionalState={type}
            getData={getMoves}
            getSearchedData={getSearchedMoves}
            renderList={CapacitesList}
        />
    )
}
