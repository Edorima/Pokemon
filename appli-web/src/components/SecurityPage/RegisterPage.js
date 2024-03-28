import {useState} from 'react'
import {useNavigate} from "react-router-dom"
import ApiManager from "../ApiManager/ApiManager"
import Form from "./Form/Form"
import UsernameInput from "./Form/UsernameInput"
import PasswordInput from "./Form/PasswordInput"
import ErrorMessage from "../ErrorMessage"
import LinkButton from "../LinkButton"

export default function RegisterPage() {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const validateInputs = (username, password) => {
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

    async function handleRegister() {
        const error = validateInputs(username, password)
        if (error) {
            setErrorMessage(error)
            return
        }

        try {
            const response = await ApiManager.register(username, password)
            const data = await response.json()
            if (data.success && data.token) {
                // Stockage du token JWT
                localStorage.setItem('token', data.token)
                navigate('/profil')
            } else
                setErrorMessage(data.message || "Échec de la création du compte.")
        } catch (_) {
            setErrorMessage("Erreur lors de la création du compte. Veuillez réessayer.")
        }
    }

    return (
        <div id="securityWrapper">
            <h1>Création du compte</h1>
            <div id="formWrapper">
                <h2>Vos identifiants</h2>
                <hr></hr>
                <ErrorMessage error={errorMessage}/>

                <Form method="POST" onSubmit={handleRegister}>
                    <UsernameInput
                        onChange={e => setUsername(e.target.value)}
                    />

                    <PasswordInput
                        onChange={e => setPassword(e.target.value)}
                    />

                    <button type="submit" id="registerButton">Créer un compte</button>
                </Form>

                <h2>Vous êtes déjà dresseur ?</h2>
                <hr></hr>

                <LinkButton id="loginButton" href="/login">
                    Connexion
                </LinkButton>
            </div>
        </div>
    )
}
