import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Logout() {
    const navigate = useNavigate()

    useEffect(() => {
        // Supprime le token JWT du localStorage
        localStorage.removeItem('token')

        // Redirige vers la page de connexion
        navigate('/login')
    }, [navigate])

    return null
}

export default Logout
