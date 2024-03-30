import {useEffect, useState} from 'react'
import {useNavigate} from "react-router-dom"
import EditEquipeCard from "./EquipeCards/EditEquipeCard"
import ErrorMessage from "../ErrorMessage"
import ViewEquipeCard from "./EquipeCards/ViewEquipeCard"
import ApiManager from "../ApiManager/ApiManager"
import './ProfilPage.css'

export default function ProfilPage() {
    const navigate = useNavigate()
    const [profil, setProfil] = useState(null)
    const [editingTeam, setEditingTeam] = useState(null)
    const [added, setAdded] = useState(false)
    const [nomEquipe, setNomEquipe] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        const token = localStorage.getItem('token')
        async function getProfil() {
            try {
                const response = await ApiManager.getProfil(token)
                const data = await response.json()
                setProfil(data)
            } catch (_) {
                localStorage.removeItem('token')
                navigate('/login')
            }
        }

        if (!token) {
            navigate('/login')
        } else
            getProfil().then()
    }, [navigate])

    const validerNomEquipe = () => {
        if (nomEquipe.trim() === '')
            return "Le nom de l'équipe ne peut pas être vide."

        if (nomEquipe.length <= 2)
            return "Le nom de l'équipe doit faire au moins 3 caractères."

        if (nomEquipe.length > 32)
            return "Le nom de l'équipe ne doit pas faire plus de 32 caractères."

        if (profil && profil.equipes.map(e => e.nom).includes(nomEquipe))
            return "L'équipe existe déjà, supprimez ou modifiez là."

        return null
    }

    const creerEquipe = () => {
        const error = validerNomEquipe()
        if (error) {
            setErrorMessage(error)
            return
        }

        // Mise à jour de l'état de manière immuable
        setProfil(prevProfil => {
            return {
                ...prevProfil,
                equipes: [
                    {nom: nomEquipe, pokemons: {
                            pokemon1: null, pokemon2: null,
                            pokemon3: null, pokemon4: null,
                            pokemon5: null, pokemon6: null
                    }},
                    ...prevProfil.equipes
                ]
            }
        })

        setAdded(true)
        setEditingTeam(0)
        setNomEquipe('')
        setErrorMessage('')
    }

    const handleInputChange = (event) => {
        setNomEquipe(event.target.value)
        setErrorMessage('')
    }

    const handleEnterPressed = (event) => {
        if (event.key === 'Enter' && editingTeam === null)
            creerEquipe()
    }

    return (
        <div id="profilWrapper">
            <h1 id="title">Créez vos <strong>équipes</strong>, {profil?.pseudo} !</h1>
            <a type="button" className="boutonAction" href="/logout">Me déconnecter</a>
            <div id="creerEquipeWrapper">
                <span>
                    <input
                        id="nomEquipe"
                        placeholder="Nom de l'équipe"
                        value={nomEquipe}
                        onChange={handleInputChange}
                        onKeyDown={handleEnterPressed}
                        disabled={editingTeam !== null}
                    />

                    <button
                        onClick={() => editingTeam === null && creerEquipe()}
                        id="creerEquipe"
                        className="boutonAction"
                        disabled={editingTeam !== null}>
                        Créer l'équipe
                    </button>
                </span>

                <ErrorMessage error={errorMessage}/>
            </div>

            {profil?.equipes.length !== 0 ? (
                <div id="mesEquipes">
                    {profil?.equipes.map((e, index) => (
                        index !== editingTeam ?
                            <ViewEquipeCard
                                key={index}
                                nom={e.nom}
                                pokemons={e.pokemons}
                                profil={profil}
                                setProfil={setProfil}
                                setEditingTeam={setEditingTeam}
                                changeDisabled={editingTeam !== null}
                                added={added}
                                setAdded={setAdded}
                            /> :
                            <EditEquipeCard
                                key={index}
                                initialNom={e.nom}
                                initialPokemons={e.pokemons}
                                profil={profil}
                                setProfil={setProfil}
                                setEditingTeam={setEditingTeam}
                                added={added}/>
                    ))}
                </div>
            ) : <span>Vous n'avez aucune équipe !</span>}

        </div>
    )
}