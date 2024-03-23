import {useState} from 'react'
import {useNavigate} from "react-router-dom"
import ApiManager from "../ApiManager/ApiManager"
import ErrorMessage from "../ErrorMessage"
import Form from "./Form/Form"
import LinkButton from "../LinkButton"
import UsernameInput from "./Form/UsernameInput"
import PasswordInput from "./Form/PasswordInput"

export default function LoginPage() {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    async function handleLogin() {
        if (!username || !password) {
            setErrorMessage("Veuillez remplir tous les champs.")
            return
        }

        try {
            const response = await ApiManager.login(username, password)
            const data = await response.json()
            if (data.success && data.token) {
                // Stocker le token JWT pour une utilisation ultérieure
                localStorage.setItem('token', data.token)
                console.log("Connexion réussie et token reçu.")
                navigate('/profil')
            } else
                setErrorMessage(data.message || "Échec de la connexion.")
        } catch (_) {
            setErrorMessage("Erreur lors de la connexion. Veuillez réessayer.")
        }
    }

    return (
        <div id="securityWrapper">
            <h1>Identifiez-vous</h1>
            <div id="formWrapper">
                <h2>Vous avez déjà un compte ?</h2>
                <hr></hr>

                <ErrorMessage error={errorMessage}/>

                <Form method="GET" onSubmit={handleLogin}>
                    <UsernameInput
                        onChange={e => setUsername(e.target.value)}
                    />

                    <PasswordInput
                        onChange={e => setPassword(e.target.value)}
                    />

                    <button type="submit" id="loginButton">Connexion</button>
                </Form>

                <h2>Vous n’êtes pas encore un dresseur ?</h2>
                <hr></hr>

                <LinkButton id="registerButton" href="/register">
                    Créer un compte
                </LinkButton>
            </div>
        </div>
    )
}