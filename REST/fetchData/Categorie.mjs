export default class Categorie {
    static #instance = 1
    id = Categorie.#instance
    nom
    constructor(nom) {
        this.nom = nom
        Categorie.#instance++
    }
}