import { useState, useEffect } from 'react'
import ApiManager from "../ApiManager/ApiManager"
import {useNavigate} from "react-router-dom"
import EditEquipeCard from "./EquipeCards/EditEquipeCard"
import ErrorMessage from "../ErrorMessage"
import './ProfilPage.css'
import ViewEquipeCard from "./EquipeCards/ViewEquipeCard";

export default function ProfilPage() {
    const navigate = useNavigate()
    const [profil, setProfil] = useState(null)
    const [editingTeam, setEditingTeam] = useState(null)
    const [added, setAdded] = useState(true)
    const [nomEquipe, setNomEquipe] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            navigate('/login')
        } else {
            ApiManager.getProfil(token)
                .then(response => {
                    if (!response.ok)
                        throw new Error()
                    return response.json()
                })
                .then(data => {
                    console.log(data)
                    setProfil(data)
                })
                .catch(() => {
                    localStorage.removeItem('token')
                    navigate('/login')
                })
        }
    }, [navigate])

    const validerNomEquipe = () => {
        if (nomEquipe.trim() === '')
            return "Le nom de l'équipe ne peut pas être vide."

        if (nomEquipe.length <= 2)
            return "Le nom de l'équipe doit faire au moins 3 caractères."

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
                        onChange={e => {
                            setNomEquipe(e.target.value)
                            setErrorMessage('')
                        }}
                        disabled={editingTeam !== null}
                    />

                    <button
                        onClick={creerEquipe}
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
                                setEditingTeam={setEditingTeam}
                                changeDisabled={editingTeam !== null}
                                added={added}
                                setAdded={setAdded}
                            /> :
                            <EditEquipeCard
                                key={index}
                                nom={e.nom}
                                initialPokemons={e.pokemons}
                                profil={profil}
                                setProfil={setProfil}
                                setEditingTeam={setEditingTeam}
                                added={added}
                            />
                    ))}
                </div>
            ) : <span>Vous n'avez aucune équipe !</span>}

        </div>
    )
}