const token = localStorage.getItem('token')

if (!token) {
    window.location.href = "/login"
} else {
    fetch('http://localhost:8081/api/v1/profile', {
        method: 'GET',
        headers: {
            // On inclus le token dans le champ Authorization
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            localStorage.removeItem('token')
            window.location.href = "/login"
        }
        return response.json()
    })
    .then(data => {
        console.log(data)
        window.addEventListener("DOMContentLoaded", () => {
            manageData(data)
        })
    })
}

function manageData(data) {
    const title = document.querySelector("#title")
    title.innerHTML += `${data.pseudo} !`

    const wrapper = document.querySelector("#wrapper")
    for (const equipe of data.equipes) {
        // TODO Ajouter les équipes au wrapper
    }
}
