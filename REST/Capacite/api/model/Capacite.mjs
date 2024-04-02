export default class Capacite {
    /** @type number */
    id

    /** @type string */
    nom

    /** @type string */
    nomAnglais

    /** @type string */
    nomNormalise

    /** @type string */
    description

    /** @type number */
    pp

    /** @type {number | null} */
    precision

    /** @type {number | null} */
    puissance

    /** @type string */
    type

    /** @type string[] */
    pokemons

    /** @type string */
    categorie

    constructor(obj) {
        if (!Number.isInteger(obj.id) || obj.id < 1)
            throw new Error("Id must be an integer greater or equal to 1")

        if (!Capacite.isNameValid(obj.nom))
            throw new Error("'nom' must be a not empty string")

        if (!Capacite.isNameValid(obj.nomAnglais))
            throw new Error("'nomAnglais' must be a not empty string")

        if (!Capacite.isNameValid(obj.nomNormalise))
            throw new Error("'nomNormalise' must be a not empty string")

        if (!Capacite.isValidPP(obj.pp))
            throw new Error("PP must be an integer greater or equal to 1")

        if (!Capacite.isValidPrecision(obj.precision))
            throw new Error("Precision must be a percentage or null")

        if (!Capacite.isValidPower(obj.puissance))
            throw new Error("Power must be an integer greater or equal to 1")

        if (!Capacite.isValidType(obj.type))
            throw new Error("Type must be a valid one")

        if (!Capacite.isValidCategory(obj.categorie))
            throw new Error("Category must be a valid one.")

        this.id = obj.id
        this.nom = obj.nom
        this.nomAnglais = obj.nomAnglais
        this.nomNormalise = obj.nomNormalise
        this.description = obj.description
        this.pp = obj.pp
        this.precision = obj.precision
        this.puissance = obj.puissance
        this.type = obj.type
        this.pokemons = obj.pokemons
        this.categorie = obj.categorie
    }

    /** Il y a 3 catégories d'attaque : Spéciale, Physique et Statut. */
    static moveCategories = ['Spéciale', 'Physique', 'Statut']

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
     * @param value
     * @return {boolean}
     */
    static isNameValid(value) {
        return typeof value === 'string' && value.length !== 0
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
     * La précision est exprimée en pourcentage.
     * Certaines capacité n'ont pas de précision,
     * par conséquant elle vaux null dans ce cas.
     * @param value {any}
     * @return {boolean}
     */
    static isValidPrecision(value) {
        if (value === null) return true
        return Number.isInteger(value) && value >= 1 && value <= 100
    }

    /**
     * La puissance est un entier positif non nul.
     * Certaines capacité n'ont pas de puissance
     * (notamment les capacités de catégorie Statut
     * ou encore celle qui inflige des dégats fixe),
     * par conséquant elle vaux null dans ce cas.
     * @param value {any}
     * @return {boolean}
     */
    static isValidPower(value) {
        if (value === null) return true
        return Number.isInteger(value) && value >= 1
    }

    /**
     * Renvoie un booléen indiquant si la valeur
     * passé en paramètre est un type valide.
     * @param value {any}
     * @return {boolean}
     */
    static isValidType(value) {
        return Capacite.validTypes.includes(value)
    }

    /**
     * Renvoie un booléen indiquant si la valeur
     * passé en paramètre est une catégorie valide.
     * @param value {any}
     * @return {boolean}
     */
    static isValidCategory(value) {
        return Capacite.moveCategories.includes(value)
    }
}