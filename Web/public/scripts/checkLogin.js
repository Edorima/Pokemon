// Vérifie si un token est présent
const token = localStorage.getItem('token')
if (token) {
    // Si c'est le cas il est redirigé
    window.location.href = "/profile"
}