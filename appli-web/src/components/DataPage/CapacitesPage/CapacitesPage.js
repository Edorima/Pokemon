import './CapacitesPage.css'
import DataPage from "../DataPage";

import ApiManager from "../../ApiManager/ApiManager";
import {useState} from "react";
import CapacitesList from "./CapacitesList";
import SelectData from "../SelectData";

function SelectType({onChange}) {
    const types = [
        'Normal', 'Combat', 'Vol', 'Poison',
        'Sol', 'Roche', 'Insecte', 'Spectre',
        'Acier', 'Feu', 'Eau', 'Plante', 'Électrik',
        'Psy', 'Glace', 'Dragon', 'Ténèbres'
    ]

    return (
        <SelectData
            onChange={onChange}
            defaultOptionText="Tous les types">
            {types.map((value, index) => (
                <option key={index} value={value}>{value}</option>
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
            wrapperId="capaciteWrapper"
            pageTitle={<>Voici la liste des <strong>Capacité</strong> !</>}
            searchBarPlaceholder="Rechercher une capacité..."
            additionalControls={[<SelectType key={'type'} onChange={handleCategoryChoice}/>]}
            additionalStates={[type]}
            getData={getMoves}
            getSearchedData={getSearchedMoves}
            renderList={CapacitesList}
        />
    )
}
