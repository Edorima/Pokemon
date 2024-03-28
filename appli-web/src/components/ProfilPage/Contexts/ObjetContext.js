import {createContext, useContext, useEffect, useState} from 'react'
import ApiManager from "../../ApiManager/ApiManager"

const ObjetContext = createContext([])

export const useObjet = () => useContext(ObjetContext)

export const ObjetProvider = ({ children }) => {
    const [objetsList, setObjetsList] = useState([])

    useEffect(() => {
        ApiManager.getAllItems()
            .then(response => response.json())
            .then(data => {
                const sortedData = [...data].sort((a, b) => {
                    // Comparaison insensible à la casse des noms
                    return a.nomNormalise.localeCompare(b.nomNormalise)
                })
                setObjetsList(sortedData)
            })
    }, [])

    return (
        <ObjetContext.Provider value={objetsList}>
            {children}
        </ObjetContext.Provider>
    )
}