import PokemonSprites from "./PokemonSprites.mjs"
import PokemonStats from "./PokemonStats.mjs"
import PokemonTalents from "./PokemonTalents.mjs"

export default class Pokemon {
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
    poids

    /** @type PokemonSprites */
    sprites

    /** @type PokemonStats */
    stats

    /** @type number */
    taille

    /** @type PokemonTalents */
    talents

    /** @type string[] */
    types

    /** @type number[] */
    capacites

    /** @type string */
    espece

    /** @type number */
    generation

    constructor(obj) {
        if (!Number.isInteger(obj.id) || obj.id < 1)
            throw new Error("Id must be an integer greater or equal to 1")

        if (!Pokemon.isNameValid(obj.nom))
            throw new Error("'nom' must be a not empty string")

        if (!Pokemon.isNameValid(obj.nomAnglais))
            throw new Error("'nomAnglais' must be a not empty string")

        if (!Pokemon.isNameValid(obj.nomNormalise))
            throw new Error("'nomNormalise' must be a not empty string")

        if (obj.description === null || typeof obj.description !== 'string')
            throw new Error("'description' must be a string")

        if (!Pokemon.isValidWeight(obj.poids))
            throw new Error("Weight must be a number between 0.1 and 999.9")

        if (obj.sprites === null || typeof obj.sprites !== 'object')
            throw new Error("'sprites' must be an object")

        if (obj.stats === null || typeof obj.stats !== 'object')
            throw new Error("'stats' must be an object")

        if (!Pokemon.isValidHeight(obj.taille))
            throw new Error("Height must be a number greater or equal to 0.1")

        if (obj.talents === null || typeof obj.talents !== 'object')
            throw new Error("'talents' must be an object")

        if (!Pokemon.isValidArrayOfTypes(obj.types))
            throw new Error("Types must be an array of atleast one valid type and not more than 2")

        if (!Array.isArray(obj.capacites) || obj.capacites.some(c => typeof c !== 'number'))
            throw new Error("'capacites' must be an array of numbers")

        if (obj.espece === null || typeof obj.espece !== 'string')
            throw new Error("'espece' must be a string")

        if (!Pokemon.isGenerationValid(obj.generation))
            throw new Error("Generation must be a integer greater or equal to 1")

        this.id = obj.id
        this.nom = obj.nom
        this.nomAnglais = obj.nomAnglais
        this.nomNormalise = obj.nomNormalise
        this.description = obj.description
        this.poids = obj.poids
        this.sprites = new PokemonSprites(obj.sprites)
        this.stats = new PokemonStats(obj.stats)
        this.taille = obj.taille
        this.talents = new PokemonTalents(obj.talents)
        this.types = obj.types
        this.capacites = obj.capacites
        this.espece = obj.espece
        this.generation = obj.generation
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
     * Pour qu'un poids soit valide, il faut que ce soit
     * un nombre entre 0.1 et 999.9 inclus.
     * @param value {any}
     * @return {boolean}
     */
    static isValidWeight(value) {
        return typeof value === 'number' &&
            value >= 0.1 && value <= 999.9
    }

    /**
     * Pour qu'une taille soit valide, il faut que ce soit
     * un nombre supérieur ou égal à 0.1.
     * @param value {any}
     * @return {boolean}
     */
    static isValidHeight(value) {
        return typeof value === 'number' &&
            value >= 0.1
    }

    /**
     * Pour qu'une génération soit valide, il faut qu'elle
     * soit un entier positif non nul.
     * @param value {any}
     * @return {boolean}
     */
    static isGenerationValid(value) {
        return Number.isInteger(value) && value >= 1
    }

    /**
     * Pour qu'un tableau de type soit valide, il faut qu'il
     * s'agisse d'un tableau, et qu'il contienne au moins un
     * type et au maximum 2 types. Les types doivent faire
     * partie de la liste des types acceptés.
     * @param typesArray {any}
     * @return {boolean}
     */
    static isValidArrayOfTypes(typesArray) {
        // Vérifie que `typesArray` est un tableau
        if (!Array.isArray(typesArray))
            return false

        // Vérifie que le tableau contient au moins un élément mais pas plus de deux
        if (typesArray.length < 1 || typesArray.length > 2)
            return false

        // Vérifie que tous les éléments du tableau sont des types valides
        return typesArray.every(type => this.validTypes.includes(type))
    }
}