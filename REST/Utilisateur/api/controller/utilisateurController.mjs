"use strict"

import utilisateurDAO from "../dao/utilisateurDAO.mjs";

const utilisateurController = {
    getUser: async (pseudo) =>
        await utilisateurDAO.getUser(pseudo),

    addUser: async (pseudo, motDePasse) =>
        await utilisateurDAO.addUser(pseudo, motDePasse),

    addTeam: async (pseudo, equipe) =>
        await utilisateurDAO.addTeam(pseudo, equipe),

    editTeam: async (pseudo, nomActuel, pokemons, nouveauNom) =>
        await utilisateurDAO.editTeam(pseudo, nomActuel, pokemons, nouveauNom),

    deleteTeam: async (pseudo, nomEquipe) =>
        await utilisateurDAO.deleteTeam(pseudo, nomEquipe)
}

export default utilisateurController