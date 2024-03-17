import React, {useState} from 'react'
import {useNavigate} from "react-router-dom"
import ApiManager from "../ApiManager/ApiManager"

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
        <div id="securityWrapper">
            <h1>Identifiez-vous</h1>
            <div id="formWrapper">
                <h2>Vous avez déjà un compte ?</h2>
                <hr></hr>
                <div id="error-message" className={errorMessage ? "" : "hidden"}>{errorMessage}</div>

                <form method="POST"
                    onSubmit={e => {
                        e.preventDefault()
                        handleLogin()
                    }}>
                    <input
                        id="username"
                        value={username}
                        placeholder="Pseudo"
                        size="32"
                        onChange={e => setUsername(e.target.value)}
                        required
                    />

                    <input
                        id="password"
                        value={password}
                        type="password"
                        placeholder="Mot de passe"
                        size="32"
                        onChange={e => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit" id="loginButton">Connexion</button>
                </form>

                <h2>Vous n’êtes pas encore un dresseur ?</h2>
                <hr></hr>
                <a type="button" id="registerButton" href="/register">Créer un compte</a>
            </div>
        </div>
    )
}

export default LoginPage
