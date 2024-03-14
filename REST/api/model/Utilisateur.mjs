export default class Utilisateur {
    /** @type {string} */
    pseudo

    /** @type {string} */
    motDePasse

    /** @type {Equipe[]} */
    equipes = []

    /** @type {Equipe | null} */
    equipePrefere = null
    constructor(obj) {
        Object.assign(this, obj)
    }
}