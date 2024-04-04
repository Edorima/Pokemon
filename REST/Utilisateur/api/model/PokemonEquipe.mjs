import ObjetPokemon from "./ObjetPokemon.mjs"
import CapacitesPokemon from "./CapacitesPokemon.mjs"
import PokemonSprites from "./Pokemon/PokemonSprites.mjs";
import PokemonTalents from "./Pokemon/PokemonTalents.mjs";

export default class PokemonEquipe {
    /** @type number */
    id

    /** @type string */
    nom

    /** @type string */
    nomNormalise

    /** @type PokemonSprites */
    sprites

    /** @type PokemonTalents */
    talents

    /** @type string[] */
    types

    /** @type boolean */
    chromatique

    /** @type {ObjetPokemon | null} */
    objet

    /** @type CapacitesPokemon */
    capacites

    constructor(obj) {
        if (!Number.isInteger(obj.id) || obj.id < 1)
            throw new Error("Id must be an integer greater or equal to 1")

        if (!PokemonEquipe.isNameValid(obj.nom))
            throw new Error("'nom' must be a not empty string")

        if (!PokemonEquipe.isNameValid(obj.nomNormalise))
            throw new Error("'nomNormalise' must be a not empty string")

        if (obj.sprites === null || typeof obj.sprites !== 'object')
            throw new Error("'sprites' must be an object")

        if (obj.talents === null || typeof obj.talents !== 'object')
            throw new Error("'talents' must be an object")

        if (!PokemonEquipe.isValidArrayOfTypes(obj.types))
            throw new Error("Types must be an array of atleast one valid type and not more than 2")

        if (obj.chromatique === null || typeof obj.chromatique !== 'boolean')
            throw new Error("'chromatique' must be a boolean")

        if (obj.objet !== null && typeof obj.objet !== 'object')
            throw new Error("'objet' must be an object or null")

        if (obj.capacites === null || typeof obj.capacites !== 'object')
            throw new Error("'capacites' must be an object")

        this.id = obj.id
        this.nom = obj.nom
        this.nomNormalise = obj.nomNormalise
        this.sprites = new PokemonSprites(obj.sprites)
        this.talents = new PokemonTalents(obj.talents)
        this.types = obj.types
        this.chromatique = obj.chromatique
        this.objet = obj.objet ? new ObjetPokemon(obj.objet) : null
        this.capacites = new CapacitesPokemon(obj.capacites)
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