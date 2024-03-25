import {useState} from "react"
import DataPage from "../DataPage"
import CapacitesList from "./CapacitesList"
import SelectData from "../SelectData"
import ApiManager from "../../ApiManager/ApiManager"
import './CapacitesPage.css'

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

function SelectCategorie({onChange}) {
    const categorie = [
        'Physique', 'Spéciale', 'Statut'
    ]

    return (
        <SelectData
            onChange={onChange}
            defaultOptionText="Toutes les catégories">
            {categorie.map((value, index) => (
                <option key={index} value={value}>{value}</option>
            ))}
        </SelectData>
    )
}


export default function CapacitesPage() {
    const [type, setType] = useState('')
    const [categorie, setCategorie] = useState('')

    const getMoves = ({offset}) => ApiManager.getMoves(type, categorie, offset)
    const getSearchedMoves = ({searchTerm, offset}) =>
        ApiManager.getMovesThatStartsWith(searchTerm, type, categorie, offset)
    const handleTypeChoice = (event) => {
        const value = event.target.value
        setType(value)
    }
    const handleCategoryChoice = (event) => {
        const value = event.target.value
        setCategorie(value)
    }

    return (
        <DataPage
            wrapperId="capaciteWrapper"
            pageTitle={<>Voici la liste des <strong>Capacité</strong> !</>}
            searchBarPlaceholder="Rechercher une capacité..."
            additionalControls={[
                <SelectType key={'type'} onChange={handleTypeChoice}/>,
                <SelectCategorie key={'categorie'} onChange={handleCategoryChoice}/>
            ]}
            additionalStates={[type, categorie]}
            getData={getMoves}
            getSearchedData={getSearchedMoves}
            renderList={CapacitesList}
        />
    )
}