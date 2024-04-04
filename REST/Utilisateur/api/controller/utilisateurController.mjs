"use strict"

import utilisateurDAO from "../dao/utilisateurDAO.mjs"
import Utilisateur from "../model/Utilisateur.mjs"
import Equipe from "../model/Equipe.mjs"
import PokemonsEquipe from "../model/PokemonsEquipe.mjs"

const utilisateurController = {
    getUser: async (pseudo) =>
        await utilisateurDAO.getUser(pseudo),

    addUser: async (utilisateur) => {
        try {
            return await utilisateurDAO.addUser(
                new Utilisateur(utilisateur)
            )
        } catch {
            throw 'Utilisateur invalide'
        }
    },

    addTeam: async (pseudo, equipe) =>
        await utilisateurDAO.addTeam(pseudo, new Equipe(equipe)),

    editTeam: async (pseudo, nomActuel, pokemons, nouveauNom) =>
        await utilisateurDAO.editTeam(pseudo, nomActuel,
            new PokemonsEquipe(pokemons), nouveauNom),

    deleteTeam: async (pseudo, nomEquipe) =>
        await utilisateurDAO.deleteTeam(pseudo, nomEquipe)
}

export default utilisateurController