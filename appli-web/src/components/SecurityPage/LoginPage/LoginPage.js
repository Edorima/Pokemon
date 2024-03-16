import React, {useState} from 'react'
import '../SecurityPage.css'
import './LoginPage.css'
import {useNavigate} from "react-router-dom"
import ApiManager from "../../ApiManager/ApiManager"

function LoginPage() {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    function handleLogin() {
        if (!username || !password) {
            setErrorMessage("Veuillez remplir tous les champs.")
            return
        }

        ApiManager.login(username, password)
            .then(response => response.json())
            .then(data => {
                if (data.success && data.token) {
                    // Stocker le token JWT pour une utilisation ultérieure
                    localStorage.setItem('token', data.token)
                    console.log("Connexion réussie et token reçu.")
                    navigate('/profil')
                } else
                    setErrorMessage(data.message || "Échec de la connexion.")
            })
            .catch(error => {
                console.error('Erreur lors de la connexion:', error)
                setErrorMessage("Erreur lors de la connexion. Veuillez réessayer.")
            })
    }

    return (
        <div id="wrapper">
            <div id="error-message" className={errorMessage ? "" : "hidden"}>{errorMessage}</div>
            <label>
                Nom d'utilisateur :
                <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </label>

            <label>
                Mot de passe
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>

            <label>
                Vous n'avez pas de compte ?
                <a type="button" href="/register">Je créer mon compte</a>
            </label>

            <button id="loginButton" onClick={handleLogin}>Se connecter</button>
        </div>
    )
}

export default LoginPage
