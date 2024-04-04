import ObjetCategorie from "./ObjetCategorie.mjs";

export default class Objet {
    /** @type string */
    nom

    /** @type string */
    nomAnglais

    /** @type string */
    nomNormalise

    /** @type string */
    description

    /** @type {string | null} */
    sprite

    /** @type ObjetCategorie */
    categorie

    constructor(obj) {
        if (!Objet.isNameValid(obj.nom))
            throw new Error("'nom' must be a not empty string")

        if (!Objet.isNameValid(obj.nomAnglais))
            throw new Error("'nomAnglais' must be a not empty string")

        if (!Objet.isNameValid(obj.nomNormalise))
            throw new Error("'nomNormalise' must be a not empty string")

        if (obj.description === null || typeof obj.description !== 'string')
            throw new Error("'description' must be a string")

        if (obj.sprite !== null && typeof obj.sprite !== 'string')
            throw new Error("'sprite' must be a string or null")

        if (obj.categorie === null || typeof obj.categorie !== 'object')
            throw new Error("'categorie' must be an object")

        this.nom = obj.nom
        this.nomAnglais = obj.nomAnglais
        this.nomNormalise = obj.nomNormalise
        this.description = obj.description
        this.sprite = obj.sprite
        this.categorie = new ObjetCategorie(obj.categorie)
    }

    /**
     * Pour qu'un nom soit valide, il doit être une
     * chaîne de caractère et qu'elle ne soit pas vide.
     * @param value
     * @return {boolean}
     */
    static isNameValid(value) {
        return value && typeof value === 'string'
    }
}