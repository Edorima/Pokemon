import data from './verifyToken.mjs'

const wrapper = document.querySelector("#wrapper")
const mesEquipes = wrapper.querySelector("#mesEquipesWrapper")
const creerEquipe = wrapper.querySelector("#creerEquipe")
const nomEquipe = wrapper.querySelector("#nomEquipe")
const errorMessage = wrapper.querySelector("#error-message")
const title = wrapper.querySelector("#title")
const equipeRes = await fetch('equipe.html')
const equipeHTML = await equipeRes.text()

function setError(message) {
    errorMessage.classList.remove("hidden")
    errorMessage.textContent = message
}

function getEquipeElement() {
    const tempContainer = document.createElement("div")
    tempContainer.innerHTML = equipeHTML
    return tempContainer.firstElementChild
}

nomEquipe.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        creerEquipe.click()
    }
})



console.log(data)
title.innerHTML += `${data.pseudo} !`
for (const equipe of data.equipes) {
    // TODO Ajouter les équipes au wrapper
}
creerEquipe.addEventListener('click', () => {
    const nom = nomEquipe.value
    if (nom === "") {
        setError("Le nom de l'équipe ne peut pas être vide.")
    } else {
        const equipe = getEquipeElement()
        const spanNomEquipe = equipe.querySelector(".nomEquipe")

        if (data.equipes.some(e => e.nom === nom)) {
            setError("Une équipe avec ce nom existe déjà.")
        } else {
            errorMessage.classList.add("hidden")
            errorMessage.textContent = ""
            spanNomEquipe.textContent = nom
            mesEquipes.appendChild(equipe)
        }
    }
})