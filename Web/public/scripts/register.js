const usernameField = document.querySelector("#username")
const passwordField = document.querySelector("#password")
const errorMessage = document.querySelector("#error-message")
const registerButton = document.querySelector("#registerButton")

passwordField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        registerButton.click()
    }
})

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

function setError(message) {
    errorMessage.classList.remove("hidden")
    errorMessage.textContent = message
}

registerButton.addEventListener('click', () => {
    const username = usernameField.value
    const password = passwordField.value

    const error = validateInputs(username, password)
    if (error) {
        setError(error)
        return
    }

    // Envoi de la requête au serveur
    fetch('http://localhost:8081/api/v1/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pseudo: username, motDePasse: password }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success && data.token) {
                // Stockage du token JWT
                localStorage.setItem('token', data.token)
                console.log("Compte crée et token reçu.")
                window.location.href = "/profile"
            } else {
                errorMessage.classList.add("hidden")
                errorMessage.textContent = ""
                errorMessage.textContent = data.message || "Échec de la création du compte."
            }
        })
        .catch(error => {
            console.error('Erreur lors de la création du compte:', error)
            setError("Erreur lors de la création du compte. Veuillez réessayer.")
        })
})