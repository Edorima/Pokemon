fetch('header.html')
    .then(response => response.text())
    .then(html => {
        document.body.insertAdjacentHTML('afterbegin', html)
        const boutonAccueil = document.querySelector("#boutonAccueil")
        const pokeball = boutonAccueil.querySelector("img")

        boutonAccueil.addEventListener('mouseenter', () => {
            pokeball.classList.add('spinning')
        })

        pokeball.addEventListener('animationend', () => {
            pokeball.classList.remove('spinning')
        })
    })