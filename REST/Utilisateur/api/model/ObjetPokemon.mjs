export default class ObjetPokemon {
    /** @type string */
    nom

    /** @type string */
    nomNormalise

    /** @type {string | null} */
    sprite

    constructor(obj) {
        if (!ObjetPokemon.isNameValid(obj.nom))
            throw new Error("'nom' must be a not empty string")

        if (!ObjetPokemon.isNameValid(obj.nomNormalise))
            throw new Error("'nomNormalise' must be a not empty string")

        if (obj.sprite !== null && typeof obj.sprite !== 'string')
            throw new Error("'sprite' must be a string or null")

        this.nom = obj.nom
        this.nomNormalise = obj.nomNormalise
        this.sprite = obj.sprite
    }

    /**
     * Pour qu'un nom soit valide, il doit être une
     * chaîne de caractère et qu'elle ne soit pas vide.
     * @param value {any}
     * @return {boolean}
     */
    static isNameValid(value) {
        return value && typeof value === 'string'
    }
}