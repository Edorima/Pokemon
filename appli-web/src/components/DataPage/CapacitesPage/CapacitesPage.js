import {useState} from "react"
import DataPage from "../DataPage"
import CapacitesList from "./CapacitesList"
import SelectType from "../SelectType"
import SelectCategorieCapacite from "./SelectCategorieCapacite"
import ApiManager from "../../ApiManager/ApiManager"
import './CapacitesPage.css'

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
                <SelectCategorieCapacite key={'categorie'} onChange={handleCategoryChoice}/>
            ]}
            additionalStates={[type, categorie]}
            getData={getMoves}
            getSearchedData={getSearchedMoves}
            renderList={CapacitesList}
        />
    )
}