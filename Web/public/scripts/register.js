const usernameField = document.querySelector("#username")
const passwordField = document.querySelector("#password")
const errorMessage = document.querySelector("#error-message")
const registerButton = document.querySelector("#registerButton")

passwordField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        registerButton.click()
    }
})

registerButton.addEventListener('click', () => {
    const username = usernameField.value
    const password = passwordField.value

    // Vérifier que les champs ne sont pas vides
    if (!username || !password) {
        errorMessage.classList.remove('hidden')
        errorMessage.textContent = "Veuillez remplir tous les champs."
        return
    }

    // Effacer le message d'erreur précédent
    errorMessage.textContent = ''

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
                // Stocker le token JWT pour une utilisation ultérieure
                localStorage.setItem('token', data.token)
                console.log(`Compte crée et token reçu: ${data.token}`)
                window.location.href = "/profile"
            } else {
                errorMessage.classList.remove('hidden')
                errorMessage.textContent = data.message || "Échec de la création du compte."
            }
        })
        .catch(error => {
            console.error('Erreur lors de la création du compte:', error)
            errorMessage.textContent = "Erreur lors de la création du compte. Veuillez réessayer."
        })
})