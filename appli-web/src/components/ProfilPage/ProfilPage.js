import React, { useState, useEffect } from 'react'
import ApiManager from "../ApiManager/ApiManager";
import './ProfilPage.css'
import {useNavigate} from "react-router-dom";

function ProfilPage() {
    const navigate = useNavigate()
    const [, setProfil] = useState(null)
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            navigate('/login')
        } else {
            ApiManager.getProfil(token)
                .then(response => {
                    if (!response.ok) {
                        localStorage.removeItem('token')
                        navigate('/login')
                    }
                })
                .then(data => {
                    console.log(data)
                    setProfil(data)
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération du profil:', error)
                })
        }
    }, [navigate])

    return (
        <div id="wrapper">
            <h1 id="title">Créez vos <strong>équipes</strong>, </h1>
            <a type="button" className="boutonAction" href="/logout">Me déconnecter</a>
            <div id="mesEquipesWrapper">
                <div id="creerEquipeWrapper">
            <span>
                <label htmlFor="nomEquipe" hidden></label>
                <input id="nomEquipe" placeholder="Nom de l'équipe"/>
                <button id="creerEquipe" className="boutonAction">Créer l'équipe</button>
            </span>
                    <span id="error-message" className="hidden"></span>
                </div>

                <div id="mesEquipes">
                </div>
            </div>
        </div>
    )
}

export default ProfilPage