import {useCallback, useState} from 'react'
import PokemonList from "./PokemonList"
import ApiManager from "../../ApiManager/ApiManager"
import DataPage from "../DataPage"
import "./PokedexPage.css"
import SelectData from "../SelectData";

function SelectGeneration({onChange}) {
    return (
        <SelectData
            onChange={onChange}
            defaultOptionText="Toutes les générations"
            defaultOptionValue='0'>
            {Array.from({length: 8}, (_, i) => (
                <option key={i} value={i + 1}>{`Génération ${i + 1}`}</option>
            ))}
        </SelectData>
    )
}

export default function PokedexPage() {
    const [generation, setGeneration] = useState(0)

    const getPkms = useCallback(({offset}) => {
        return ApiManager.getPkms(generation, offset)
    }, [generation])

    const getSearchedPkms = useCallback(({searchTerm, offset}) => {
        return ApiManager.getPkmsThatStartsWith(searchTerm, generation, offset)
    }, [generation])

    const handleGenChoice = (event) => {
        const value = event.target.value
        setGeneration(parseInt(value))
    }
    return (
        <DataPage
            wrapperId="pokedexWrapper"
            pageTitle={<>Bienvenue sur le <strong>Pokédex</strong> !</>}
            searchBarPlaceholder="Rechercher un Pokémon..."
            additionalControls={[<SelectGeneration key={'generation'} onChange={handleGenChoice}/>]}
            additionalStates={[generation]}
            getData={getPkms}
            getSearchedData={getSearchedPkms}
            renderList={PokemonList}
        />
    )
}