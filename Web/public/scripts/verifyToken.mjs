const token = localStorage.getItem('token')

let data = {}

if (!token) {
    window.location.href = "/login"
} else {
    const res = await fetch('http://localhost:8081/api/v1/profile', {
        method: 'GET',
        headers: {
            // On inclus le token dans le champ Authorization
            'Authorization': `Bearer ${token}`
        }
    })

    if (!res.ok) {
        localStorage.removeItem('token')
        window.location.href = "/login"
    }

    data = await res.json()
}

export default data