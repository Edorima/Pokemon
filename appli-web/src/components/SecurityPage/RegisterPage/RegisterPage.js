import React, {useState} from 'react'
import '../SecurityPage.css'
import './RegisterPage.css'
import {useNavigate} from "react-router-dom";
import ApiManager from "../../ApiManager/ApiManager";

function RegisterPage() {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    function validateInputs(username, password) {
        if (!username || !password)
            return "Veuillez remplir tous les champs."

        if (username.length < 3 || username.length > 20)
            return "Votre pseudo doit faire entre 3 et 20 caractères."

        if (password.length < 7)
            return "Votre mot de passe doit faire minimum 7 caractères."

        if (password.length > 250)
            return "Veuillez réduire la longueur de votre mot de passe."

        return null
    }

    function handleRegister() {
        const error = validateInputs(username, password)
        if (error) {
            setErrorMessage(error)
            return
        }

        ApiManager.register(username, password)
            .then(response => response.json())
            .then(data => {
                if (data.success && data.token) {
                    // Stockage du token JWT
                    localStorage.setItem('token', data.token)
                    console.log("Compte crée et token reçu.")
                    navigate('/profil')
                } else {
                    setErrorMessage(data.message || "Échec de la création du compte.")
                }
            })
            .catch(error => {
                console.error('Erreur lors de la création du compte:', error)
                setErrorMessage("Erreur lors de la création du compte. Veuillez réessayer.")
            })
    }

    return (
        <div id="wrapper">
            <div id="error-message" className={errorMessage ? "" : "hidden"}>{errorMessage}</div>
            <label>
                Nom d'utilisateur :
                <input id="username" value={username} onChange={(e) => setUsername(e.target.value)}/>
            </label>

            <label>
                Mot de passe
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </label>

            <label>
                Vous avez déjà un compte ?
                <a type="button" href="/login">Je me connecte</a>
            </label>

            <button id="registerButton" onClick={handleRegister}>Créer un compte</button>
        </div>
    )
}

export default RegisterPage
