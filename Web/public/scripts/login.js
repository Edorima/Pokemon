const usernameField = document.querySelector("#username")
const passwordField = document.querySelector("#password")
const errorMessage = document.querySelector("#error-message")
const loginButton = document.querySelector("#loginButton")

passwordField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        loginButton.click()
    }
})

loginButton.addEventListener('click', () => {
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
    fetch('http://localhost:8081/api/v1/login', {
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
                console.log(`Connexion réussie et token reçu: ${data.token}`)
                window.location.href = "/profile"
            } else {
                errorMessage.classList.remove('hidden')
                errorMessage.textContent = data.message || "Échec de la connexion."
            }
        })
        .catch(error => {
            console.error('Erreur lors de la connexion:', error)
            errorMessage.textContent = "Erreur lors de la connexion. Veuillez réessayer."
        })
})