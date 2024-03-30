import {useCallback, useState} from 'react'
import PokemonList from "./PokemonList"
import DataPage from "../DataPage"
import SelectGeneration from "./SelectGeneration"
import SelectType from "../SelectType"
import ApiManager from "../../ApiManager/ApiManager"
import "./PokedexPage.css"

// Permet une insertion conditionnel dans un tableau
function insertIf(condition, ...elements) {
    return condition ? elements : []
}

export default function PokedexPage() {
    const [generation, setGeneration] = useState(0)
    const [type1, setType1] = useState('')
    const [type2, setType2] = useState('')

    const getPkms = useCallback(({offset}) => {
        return ApiManager.getPkms(generation, type1, type2, offset)
    }, [generation, type1, type2])

    const getSearchedPkms = useCallback(({searchTerm, offset}) => {
        return ApiManager.getPkmsThatStartsWith(searchTerm, generation, type1, type2, offset)
    }, [generation, type1, type2])

    const handleGenChoice = (event) => {
        const value = event.target.value
        setGeneration(parseInt(value))
    }

    const handleType1Choice = (event) => {
        setType1(event.target.value)
        setType2('')
    }

    const handleType2Choice = (event) => {
        setType2(event.target.value)
    }

    return (
        <DataPage
            wrapperId="pokedexWrapper"
            pageTitle={<>Bienvenue sur le <strong>Pokédex</strong> !</>}
            searchBarPlaceholder="Rechercher un Pokémon..."
            additionalControls={[
                <SelectGeneration key='generation' onChange={handleGenChoice}/>,
                <SelectType key='type1' onChange={handleType1Choice} name='type1'/>,
                ...insertIf(type1, <SelectType
                    key='type2'
                    selectedValue={type2}
                    defaultOptionText='Pas de 2ème type'
                    onChange={handleType2Choice}
                    doNotInclude={type1}
                    name='type2'
                />)
            ]}
            additionalStates={[generation, type1, type2]}
            getData={getPkms}
            getSearchedData={getSearchedPkms}
            renderList={PokemonList}
        />
    )
}