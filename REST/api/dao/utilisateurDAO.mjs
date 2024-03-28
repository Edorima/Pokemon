"use strict"

import {MongoClient} from "mongodb";
import Utilisateur from "../model/Utilisateur.mjs";
import bcrypt from 'bcrypt'

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017'

const utilisateurDAO = {
    /**
     * Accède à la collection 'utilisateur' dans MongoDB
     */
    get collection() {
        const client = new MongoClient(dbUrl)
        const db = client.db('pokemanager')
        return db.collection('utilisateur')
    },

    /**
     * Trouve un utilisateur par son pseudo.
     * @param pseudo {string} - Le pseudo de l'utilisateur à trouver.
     * @returns {Promise<Utilisateur | null>} - Promesse résolvant un utilisateur ou null si non trouvé.
     */
    getUser: async (pseudo) => {
        const data = await utilisateurDAO.collection.findOne(
            {pseudo: pseudo}, {projection: {_id: 0}}
        )
        return data ? new Utilisateur(data) : null
    },

    /**
     * Ajoute un nouvel utilisateur à la base de données s'il n'existe pas déjà.
     * @param pseudo {string} - Le pseudo de l'utilisateur.
     * @param motDePasse {string} - Le mot de passe de l'utilisateur.
     * @returns {Promise<boolean>} - Promesse résolvant en true si l'utilisateur est ajouté, false s'il existe déjà.
     */
    addUser: async (pseudo, motDePasse) => {
        const utilisateur = utilisateurDAO.collection
        const result = await utilisateur.findOne({pseudo: pseudo})
        if (result) return false
        const mdpCrypte = await bcrypt.hash(motDePasse, 10)
        await utilisateur.insertOne(new Utilisateur({pseudo, mdpCrypte}))
        return true
    },

    /**
     * Ajoute une équipe à la liste des équipes d'un utilisateur.
     * @param pseudo {string} - Le pseudo de l'utilisateur.
     * @param equipe {Object} - L'équipe à ajouter.
     * @return {Promise<boolean>} - Promesse résolvant en true si l'équipe est ajoutée, false si l'équipe existe déjà.
     */
    addTeam: async (pseudo, equipe) => {
        const collection = utilisateurDAO.collection
        const filter = {pseudo: pseudo}

        const user = await collection.findOne(filter)
        if (user.equipes.some(t => t.nom === equipe.nom))
            return false

        await collection.updateOne(filter, {$push: {equipes: equipe}})
        return true
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
        const result = await utilisateurDAO.collection.updateOne(
            {'equipes.nom': nomActuel, pseudo: pseudo},
            {$set: {
                'equipes.$.pokemons': pokemons,
                'equipes.$.nom': nouveauNom
            }}
        )
        return result.modifiedCount === 1
    },

    /**
     * Supprime une équipe spécifique d'un utilisateur.
     * @param pseudo {string} - Le pseudo de l'utilisateur.
     * @param nomEquipe {string} - Le nom de l'équipe à supprimer.
     * @return {Promise<boolean>} - Promesse résolvant en true si l'équipe est supprimée, false sinon.
     */
    deleteTeam: async (pseudo, nomEquipe) => {
        const result = await utilisateurDAO.collection.updateOne(
            {pseudo: pseudo},
            {$pull: {equipes: {nom: nomEquipe}}}
        )
        return result.modifiedCount === 1
    }
}

export default utilisateurDAO