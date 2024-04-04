export default class CapacitePokemon {
    /** @type number */
    id

    /** @type string */
    nom

    /** @type string */
    nomNormalise

    /** @type string */
    type

    /** @type number */
    pp

    constructor(obj) {
        if (!Number.isInteger(obj.id) || obj.id < 1)
            throw new Error("Id must be an integer greater or equal to 1")

        if (!CapacitePokemon.isNameValid(obj.nom))
            throw new Error("'nom' must be a not empty string")

        if (!CapacitePokemon.isNameValid(obj.nomNormalise))
            throw new Error("'nomNormalise' must be a not empty string")

        if (!CapacitePokemon.isValidType(obj.type))
            throw new Error("Type must be a valid one")

        if (!CapacitePokemon.isValidPP(obj.pp))
            throw new Error("PP must be an integer greater or equal to 1")

        this.id = obj.id
        this.nom = obj.nom
        this.nomNormalise = obj.nomNormalise
        this.type = obj.type
        this.pp = obj.pp
    }

    /** La liste des types valides. */
    static validTypes = [
        'Acier', 'Combat', 'Dragon', 'Eau', 'Feu',
        'Fée', 'Glace', 'Insecte', 'Normal', 'Plante',
        'Poison', 'Psy', 'Roche', 'Sol', 'Spectre',
        'Ténèbres', 'Vol', 'Électrik'
    ]

    /**
     * Pour qu'un nom soit valide, il doit être une
     * chaîne de caractère et qu'elle ne soit pas vide.
     * @param value {any}
     * @return {boolean}
     */
    static isNameValid(value) {
        return value && typeof value === 'string'
    }

    /**
     * Les PP doivent être un nombre positif non nul.
     * @param value {any}
     * @return {boolean}
     */
    static isValidPP(value) {
        return Number.isInteger(value) && value >= 1
    }

    /**
     * Renvoie un booléen indiquant si la valeur
     * passé en paramètre est un type valide.
     * @param value {any}
     * @return {boolean}
     */
    static isValidType(value) {
        return this.validTypes.includes(value)
    }
}