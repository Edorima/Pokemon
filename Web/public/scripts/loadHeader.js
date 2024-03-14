fetch('header.html')
    .then(response => response.text())
    .then(html => {
        document.body.insertAdjacentHTML('afterbegin', html)
    })