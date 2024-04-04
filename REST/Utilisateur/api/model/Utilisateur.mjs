import Equipe from "./Equipe.mjs"
import bcrypt from "bcrypt"

export default class Utilisateur {
    /** @type string */
    pseudo

    /** @type string */
    motDePasse

    /** @type Equipe[] */
    equipes = []

    /** @type {string | null} */
    equipePrefere = null

    constructor(obj) {
        if (obj.pseudo === null || typeof obj.pseudo !== 'string' || obj.pseudo.length < 3)
            throw new Error("'pseudo' must be a string of atleast length 3")

        if (obj.motDePasse === null || typeof obj.motDePasse !== 'string' || obj.motDePasse.length < 7)
            throw new Error("'motDePasse' must be a string of atleast length 7")

        if (obj.equipes !== undefined)
            if (Array.isArray(obj.equipes) && obj.equipes.every(obj => typeof obj === 'object'))
                this.equipes = obj.equipes.map(obj => new Equipe(obj))
            else
                throw new Error("'equipes' must be an array of objects or be undefined")

        if (obj.equipePrefere !== undefined)
            if (obj.equipePrefere === null || typeof obj.equipePrefere === 'string')
                this.equipePrefere = obj.equipePrefere
            else
                throw new Error("'equipePrefere' must be a string or null")

        this.pseudo = obj.pseudo
        this.motDePasse = obj.motDePasse
    }

    /**
     * Hache le mot de passe.
     * @return {Promise<void>}
     */
    async hacherMotDePasse() {
        this.motDePasse = await bcrypt.hash(this.motDePasse, 10)
    }

    /**
     * @param nomEquipe {string}
     * @return {Equipe | null}
     */
    obtenirEquipe(nomEquipe) {
        return this.equipes.find(e => e.nom === nomEquipe) ?? null
    }

    /**
     * Ajoute une équipe à la liste des équipes
     * s'il y'en a pas déjà une du même nom.
     * @param equipe {Equipe}
     * @return boolean
     */
    ajouterEquipe(equipe) {
        if (this.equipes.some(t => t.nom === equipe.nom))
            return false
        this.equipes.push(equipe)
        return true
    }

    /**
     * Modifie une équipe si elle existe.
     * Renvoie true si l'équipe a été modifiée
     * et false sinon.
     * @param nomActuel {string}
     * @param pokemons {PokemonsEquipe}
     * @param nouveauNom {string}
     * @return boolean
     */
    modifierEquipe(nomActuel, pokemons, nouveauNom = nomActuel) {
        const equipeIndex = this.equipes.findIndex(e => e.nom === nomActuel)
        if (equipeIndex === -1)
            return false

        this.equipes[equipeIndex].nom = nouveauNom
        this.equipes[equipeIndex].pokemons = pokemons
        return true
    }

    supprimerEquipe(nomEquipe) {
        const equipeIndex = this.equipes.findIndex(e => e.nom === nomEquipe)
        if (equipeIndex === -1)
            return false

        this.equipes.splice(equipeIndex, 1)
        return true
    }
}