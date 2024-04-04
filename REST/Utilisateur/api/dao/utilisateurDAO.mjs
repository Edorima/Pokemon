"use strict"

import UtilisateurModel from "./UtilisateurModel.mjs"
import Utilisateur from "../model/Utilisateur.mjs"

const utilisateurDAO = {
    removeAll: async () => {
        await UtilisateurModel.deleteMany()
    },

    /**
     * Trouve un utilisateur par son pseudo.
     * @param pseudo {string} - Le pseudo de l'utilisateur à trouver.
     * @returns {Promise<Utilisateur | null>} - Promesse résolvant un utilisateur ou null si non trouvé.
     */
    getUser: async (pseudo) => {
        const user = await UtilisateurModel.findOne(
            {pseudo: pseudo},
            null,
            null
        ).exec()

        return user ? new Utilisateur(user) : null
    },

    /**
     * Ajoute un nouvel utilisateur à la base de données s'il n'existe pas déjà.
     * @param utilisateur {Utilisateur} - L'utilisateur à ajouter.
     * @returns {Promise<Utilisateur>} - Promesse résolvant en true si l'utilisateur est ajouté, false s'il existe déjà.
     */
    addUser: async (utilisateur) => {
        // Vérifier si l'utilisateur existe déjà

        if (await utilisateurDAO.getUser(utilisateur.pseudo))
            throw "L'utilisateur existe déjà"

        // Hacher le mot de passe
        await utilisateur.hacherMotDePasse()

        // Créer une nouvelle instance de l'utilisateur
        const newUser = new UtilisateurModel(utilisateur)

        // Sauvegarder l'utilisateur dans la base de données
        await newUser.save()

        // L'utilisateur a été créé avec succès
        return utilisateur
    },

    /**
     * Trouve l'équipe d'un utilisateur par son nom.
     * Renvoie null si l'utilisateur ou l'équipe n'existe pas.
     * @param pseudo {string}
     * @param nomEquipe {string}
     * @return {Promise<Equipe|null>}
     */
    getTeam: async (pseudo, nomEquipe) => {
        const user = await utilisateurDAO.getUser(pseudo)
        return user ? user.obtenirEquipe(nomEquipe) : null
    },

    /**
     * Ajoute une équipe à la liste des équipes d'un utilisateur.
     * @param pseudo {string} - Le pseudo de l'utilisateur.
     * @param equipe {Equipe} - L'équipe à ajouter.
     * @return {Promise<void>} - Promesse résolvant en true si l'équipe est ajoutée, false si l'équipe existe déjà.
     */
    addTeam: async (pseudo, equipe) => {
        // Recherche l'utilisateur par son pseudo
        const utilisateur = await utilisateurDAO.getUser(pseudo)

        if (!utilisateur.ajouterEquipe(equipe))
            throw "L'équipe existe déjà"

        // Met à jour les équipes de l'utilisateur
        await UtilisateurModel.updateOne(
            { pseudo: pseudo },
            { $set: {equipes: utilisateur.equipes} }
        ).exec()
    },

    /**
     * Modifie les détails d'une équipe existante d'un utilisateur.
     * @param pseudo {string} - Le pseudo de l'utilisateur.
     * @param nomActuel {string} - Le nom de l'équipe à modifier
     * @param pokemons {PokemonsEquipe} - Les pokémons avec les détails modifiés.
     * @param nouveauNom {string} - Le nouveau nom de l'équipe.
     * @return {Promise<boolean>} - Promesse résolvant en true si l'équipe est modifiée, false sinon.
     */
    editTeam: async (
        pseudo,
        nomActuel,
        pokemons,
        nouveauNom = nomActuel
    ) => {
        // Recherche l'utilisateur par son pseudo
        const utilisateur = await utilisateurDAO.getUser(pseudo)

        // Si l'équipe n'a pas été modifié on renvoie faux.
        if (!utilisateur.modifierEquipe(nomActuel, pokemons, nouveauNom))
            throw "L'équipe n'existe pas"

        // Met à jour les équipes de l'utilisateur
        const result = await UtilisateurModel.updateOne(
            { pseudo: pseudo },
            {$set: {equipes: utilisateur.equipes}}
        ).exec()

        // Vérifie si la mise à jour a affecté exactement un document.
        return result.modifiedCount === 1
    },

    /**
     * Supprime une équipe spécifique d'un utilisateur.
     * @param pseudo {string} - Le pseudo de l'utilisateur.
     * @param nomEquipe {string} - Le nom de l'équipe à supprimer.
     * @return {Promise<void>} - Promesse résolvant en true si l'équipe est supprimée, false sinon.
     */
    deleteTeam: async (pseudo, nomEquipe) => {
        const user = await utilisateurDAO.getUser(pseudo)

        if (!user.supprimerEquipe(nomEquipe))
            throw "L'équipe n'existe pas"

        // Met à jour les équipes de l'utilisateur
        await UtilisateurModel.updateOne(
            { pseudo: pseudo },
            {$set: {equipes: user.equipes}}
        ).exec()
    }
}

export default utilisateurDAO