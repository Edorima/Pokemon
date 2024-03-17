import React, { useState, useEffect } from 'react'
import ApiManager from "../ApiManager/ApiManager";
import './ProfilPage.css'
import {useNavigate} from "react-router-dom";
import EquipeCard from "./EquipeCard";

function ProfilPage() {
    const navigate = useNavigate()
    const [profil, setProfil] = useState(null)
    const [nomEquipe, setNomEquipe] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            navigate('/login')
        } else {
            ApiManager.getProfil(token)
                .then(response => {
                    if (!response.ok)
                        throw new Error()
                    return response.json()
                })
                .then(data => {
                    console.log(data)
                    setProfil(data)
                })
                .catch(() => {
                    localStorage.removeItem('token')
                    navigate('/login')
                })
        }
    }, [navigate])

    function validateNomEquipe() {
        if (nomEquipe.trim() === '')
            return "Le nom de l'équipe ne peut pas être vide."

        if (nomEquipe.length <= 2)
            return "Le nom de l'équipe doit faire au moins 3 caractères."

        if (profil && profil.equipes.map(e => e.nom).includes(nomEquipe))
            return "L'équipe existe déjà, supprimez ou modifiez là."

        return null
    }

    function creerEquipe() {
        const error = validateNomEquipe()
        if (error) {
            setErrorMessage(error)
            return
        }

        // Mise à jour de l'état de manière immuable
        setProfil(prevProfil => {
            return {
                ...prevProfil,
                equipes: [
                    ...prevProfil.equipes,
                    {nom: nomEquipe, pokemons: []}
                ]
            }
        })

        setNomEquipe('')
        setErrorMessage('')
    }

    return (
        <div id="profilWrapper">
            <h1 id="title">Créez vos <strong>équipes</strong>, {profil?.pseudo} !</h1>
            <a type="button" className="boutonAction" href="/logout">Me déconnecter</a>
            <div id="mesEquipesWrapper">
                <div id="creerEquipeWrapper">
                    <span>
                        <label htmlFor="nomEquipe" hidden></label>
                        <input
                            id="nomEquipe"
                            placeholder="Nom de l'équipe"
                            onChange={e => {
                                setNomEquipe(e.target.value)
                                setErrorMessage('')
                            }}/>
                        <button
                            onClick={creerEquipe}
                            id="creerEquipe"
                            className="boutonAction">
                            Créer l'équipe
                        </button>
                    </span>
                    <span
                        id="error-message"
                        className={errorMessage ? '' : 'hidden'}>
                        {errorMessage}
                    </span>
                </div>

                <div id="mesEquipes">
                    {profil?.equipes.map(e =>
                        <EquipeCard
                            key={e.nom}
                            nom={e.nom}
                            initialPokemons={e.pokemons}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProfilPage