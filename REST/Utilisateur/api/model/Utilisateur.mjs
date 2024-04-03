/**
 * Pour qu'un nom soit valide, il doit être une
 * chaîne de caractère et qu'elle ne soit pas vide.
 * @param value {any}
 * @return {boolean}
 */
function isNameValid(value) {
    return typeof value === 'string' && value.length !== 0
}

/** La liste des types valides. */
const validTypes = [
    'Acier', 'Combat', 'Dragon', 'Eau', 'Feu',
    'Fée', 'Glace', 'Insecte', 'Normal', 'Plante',
    'Poison', 'Psy', 'Roche', 'Sol', 'Spectre',
    'Ténèbres', 'Vol', 'Électrik'
]

class ObjetPokemon {
    /** @type string */
    nom

    /** @type string */
    nomNormalise

    /** @type {string | null} */
    sprite

    constructor(obj) {
        if (!isNameValid(obj.nom))
            throw new Error("'nom' must be a not empty string")

        if (!isNameValid(obj.nomNormalise))
            throw new Error("'nomNormalise' must be a not empty string")

        if (obj.sprite !== null && typeof obj.sprite !== 'string')
            throw new Error("'sprite' must be a string or null")

        this.nom = obj.nom
        this.nomNormalise = obj.nomNormalise
        this.sprite = obj.sprite
    }
}

class CapacitePokemon {
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
        if (!isNameValid(obj.nom))
            throw new Error("'nom' must be a not empty string")

        if (!isNameValid(obj.nomNormalise))
            throw new Error("'nomNormalise' must be a not empty string")

        this.id = obj.id
        this.nom = obj.nom
        this.nomNormalise = obj.nomNormalise
        this.type = obj.type
        this.pp = obj.pp
    }
}

class CapacitesPokemon {
    /** @type {CapacitePokemon | null} */
    capacite1

    /** @type {CapacitePokemon | null} */
    capacite2

    /** @type {CapacitePokemon | null} */
    capacite3

    /** @type {CapacitePokemon | null} */
    capacite4

    constructor(obj) {
        this.capacite1 = obj.capacite1
        this.capacite2 = obj.capacite2
        this.capacite3 = obj.capacite3
        this.capacite4 = obj.capacite4
    }
}

class PokemonEquipe {
    /** @type number */
    id

    /** @type string */
    nom

    /** @type string */
    nomNormalise

    /** @type {{default: string, shiny: string}} */
    sprites

    /** @type {{normaux: string[], cache: string | null}} */
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
        if (!isNameValid(obj.nom))
            throw new Error("'nom' must be a not empty string")

        if (!isNameValid(obj.nomNormalise))
            throw new Error("'nomNormalise' must be a not empty string")

        if (!PokemonEquipe.isValidArrayOfTypes(obj.types))

        this.nom = obj.nom
        this.nomNormalise = obj.nomNormalise
        this.sprites = obj.sprites
        this.talents = obj.talents
        this.types = obj.types
        this.chromatique = obj.chromatique
        this.objet = obj.objet ? new ObjetPokemon(obj.objet) : null
        this.capacites = new CapacitesPokemon(obj.capacites)
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
        return typesArray.every(type => validTypes.includes(type))
    }
}

class PokemonsEquipe {
    /** @type PokemonEquipe */
    pokemon1

    /** @type {PokemonEquipe | null} */
    pokemon2

    /** @type {PokemonEquipe | null} */
    pokemon3

    /** @type {PokemonEquipe | null} */
    pokemon4

    /** @type {PokemonEquipe | null} */
    pokemon5

    /** @type {PokemonEquipe | null} */
    pokemon6

    constructor(obj) {
        for (let i = 1; i <= 6; i++) {
            if (obj[`pokemon${i}`] === null)
                this[`pokemon${i}`] = null
            else if (typeof obj[`pokemon${i}`] !== 'object')
                throw new Error(`'pokemon${i}' must be an object`)

            this[`pokemon${i}`] = new PokemonEquipe(obj[`pokemon${i}`])
        }
    }
}

class Equipe {
    /** @type string */
    nom

    /** @type PokemonsEquipe */
    pokemons

    constructor(obj) {
        if (typeof obj.nom !== 'string')
            throw new Error("'nom' must be a string")

        if (typeof obj.pokemons !== 'object')
            throw new Error("'pokemons' must be an object")

        this.nom = obj.nom
        this.pokemons = new PokemonsEquipe(obj.pokemons)
    }
}

export {validTypes}
export default class Utilisateur {
    /** @type string */
    pseudo

    /** @type string */
    motDePasse

    /** @type Equipe[] */
    equipes= []

    /** @type {string | null} */
    equipePrefere = null

    constructor(obj) {
        if (typeof obj.pseudo !== 'string' || obj.pseudo.length < 3)
            throw new Error("'pseudo' must be a string of atleast length 3")

        if (typeof obj.motDePasse !== 'string' || obj.motDePasse.length < 7)
            throw new Error("'motDePasse' must be a string of atleast length 7")

        if (!Array.isArray(obj.equipes) || obj.equipes.some(obj => typeof obj !== 'object'))
            throw new Error("'equipes' must be an array of objects")

        if (obj.equipePrefere !== null && typeof obj.equipePrefere !== 'string')
            throw new Error("'equipePrefere' must be a string or null")

        this.pseudo = obj.pseudo
        this.motDePasse = obj.motDePasse
        this.equipes = obj.equipes.map(obj => new Equipe(obj))
        this.equipePrefere = obj.equipePrefere
    }
}