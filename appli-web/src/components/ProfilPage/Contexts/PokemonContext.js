import {createContext, useContext, useEffect, useState} from 'react'
import ApiManager from "../../ApiManager/ApiManager"

const PokemonContext = createContext([])

export const usePokemon = () => useContext(PokemonContext)

export const PokemonProvider = ({ children }) => {
    const [pokemonsList, setPokemonsList] = useState([])

    useEffect(() => {
        ApiManager.getAllPkms()
            .then(response => response.json())
            .then(data => {
                const sortedData = [...data].sort((a, b) => {
                    // Comparaison insensible à la casse des noms
                    return a.nomNormalise.localeCompare(b.nomNormalise)
                })
                setPokemonsList(sortedData)
            })
    }, [])

    return (
        <PokemonContext.Provider value={pokemonsList}>
            {children}
        </PokemonContext.Provider>
    )
}