export default class Utilisateur {
    /** @type {string} */
    pseudo

    /** @type {string} */
    motDePasse

    equipes = []

    equipePrefere = null

    constructor(obj) {
        Object.assign(this, obj)
    }
}