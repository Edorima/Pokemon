import {useState} from "react"
import ItemList from "./ItemList"
import DataPage from "../DataPage"
import SelectData from "../SelectData"
import ApiManager from "../../ApiManager/ApiManager"
import './ItemsPage.css'

function SelectCategorie({onChange}) {
    const map = new Map([
        [1, "Boosts de statistiques"], [2, "Réducteur d'EVs"],
        [3, "Médecine"], [4, "Autres"], [5, "Dans un état critique"],
        [6, "Soin conditionnel"], [7, "Protection contre un type"],
        [8, "Évolution"], [9, "Via Spéléologie"], [10, "Objet porté"],
        [11, "Choix"], [12, "Booster d'EV"], [13, "Portable avec un effet négatif"],
        [14, "Entraînement"], [15, "Plaques"], [16, "Spécifique à une espèce"],
        [17, "Amélioration de type"], [18, "Butin"], [19, "Vitamines"],
        [20, "Soins"], [21, "Récupération de PP"], [22, "Réanimation"],
        [23, "Soins de Statuts"], [24, "Pokéballs spéciales"],
        [25, "Pokéballs standards"], [26, "Méga-Gemmes"]
    ])

    return (
        <SelectData
            onChange={onChange}
            defaultOptionText="Tous les objets">
            {[...map].map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
            ))}
        </SelectData>
    )
}

export default function ItemsPage() {
    const [category, setCategory] = useState(null)

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
            additionalControl={<SelectCategorie onChange={handleCategoryChoice}/>}
            additionalState={category}
            getData={getItems}
            getSearchedData={getSearchedItems}
            renderList={ItemList}
        />
    )
}