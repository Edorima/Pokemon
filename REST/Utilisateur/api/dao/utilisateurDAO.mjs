"use strict"

import bcrypt from 'bcrypt'
import UtilisateurModel from "./UtilisateurModel.mjs"
import Utilisateur from "../model/Utilisateur.mjs"

const utilisateurDAO = {
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
        )

        return user ? new Utilisateur(user) : null
    },

    /**
     * Ajoute un nouvel utilisateur à la base de données s'il n'existe pas déjà.
     * @param pseudo {string} - Le pseudo de l'utilisateur.
     * @param motDePasse {string} - Le mot de passe de l'utilisateur.
     * @returns {Promise<boolean>} - Promesse résolvant en true si l'utilisateur est ajouté, false s'il existe déjà.
     */
    addUser: async (pseudo, motDePasse) => {
        // Vérifier si l'utilisateur existe déjà
        let utilisateur = await utilisateurDAO.getUser(pseudo)
        if (utilisateur) return false // L'utilisateur existe déjà

        // Hacher le mot de passe
        const mdpCrypte = await bcrypt.hash(motDePasse, 10)

        // Créer une nouvelle instance de l'utilisateur
        const newUser = new UtilisateurModel({pseudo: pseudo, motDePasse: mdpCrypte})

        // Sauvegarder l'utilisateur dans la base de données
        await newUser.save()

        // L'utilisateur a été créé avec succès
        return true
    },

    /**
     * Ajoute une équipe à la liste des équipes d'un utilisateur.
     * @param pseudo {string} - Le pseudo de l'utilisateur.
     * @param equipe {Object} - L'équipe à ajouter.
     * @return {Promise<boolean>} - Promesse résolvant en true si l'équipe est ajoutée, false si l'équipe existe déjà.
     */
    addTeam: async (pseudo, equipe) => {
        // Recherche l'utilisateur par son pseudo
        const utilisateur = await utilisateurDAO.getUser(pseudo)

        // Vérifie si l'utilisateur a déjà une équipe avec le même nom
        if (utilisateur.equipes.some(t => t.nom === equipe.nom))
            return false // Une équipe avec le même nom existe déjà

        // Ajoute l'équipe au tableau d'équipes de l'utilisateur
        await UtilisateurModel.updateOne(
            { pseudo: pseudo },
            { $push: { equipes: equipe } }
        )

        return true // L'équipe a été ajoutée avec succès
    },

    /**
     * Modifie les détails d'une équipe existante d'un utilisateur.
     * @param pseudo {string} - Le pseudo de l'utilisateur.
     * @param nomActuel {string} - Le nom de l'équipe à modifier
     * @param pokemons {Object} - Les pokémons avec les détails modifiés.
     * @param nouveauNom {string} - Le nouveau nom de l'équipe.
     * @return {Promise<boolean>} - Promesse résolvant en true si l'équipe est modifiée, false sinon.
     */
    editTeam: async (pseudo, nomActuel, pokemons, nouveauNom) => {
        // Met à jour l'équipe spécifiée de l'utilisateur en utilisant l'opérateur de position $.
        // Cela permet de cibler l'élément spécifique du tableau 'equipes' correspondant au critère.
        const result = await UtilisateurModel.updateOne(
            { 'equipes.nom': nomActuel, pseudo: pseudo },
            {
                $set: {
                    'equipes.$.pokemons': pokemons, // Met à jour les pokémons de l'équipe
                    'equipes.$.nom': nouveauNom // Met à jour le nom de l'équipe
                }
            }
        )

        // Vérifie si la mise à jour a affecté exactement un document.
        return result.modifiedCount === 1
    },

    /**
     * Supprime une équipe spécifique d'un utilisateur.
     * @param pseudo {string} - Le pseudo de l'utilisateur.
     * @param nomEquipe {string} - Le nom de l'équipe à supprimer.
     * @return {Promise<boolean>} - Promesse résolvant en true si l'équipe est supprimée, false sinon.
     */
    deleteTeam: async (pseudo, nomEquipe) => {
        // Exécute la mise à jour pour retirer l'équipe du tableau 'equipes' de l'utilisateur
        const result = await UtilisateurModel.updateOne(
            { pseudo: pseudo },
            { $pull: { equipes: { nom: nomEquipe } } } // Utilise $pull pour retirer l'équipe
        )

        // Vérifie si la mise à jour a affecté exactement un document
        return result.modifiedCount === 1
    }
}

export default utilisateurDAO