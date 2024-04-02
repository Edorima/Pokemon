export default class Pokemon {
    /** @type number */
    id
    /** @type string */
    nom
    /** @type string */
    nomAnglais
    /** @type string */
    nomNormalise
    /** @type number */
    poids
    /** @type {{default: string, shiny: string}} */
    sprite
    /** @type {{
        hp: number,
        attack: number,
        defense: number,
        special_attack: number,
        special_defense: number,
        speed: number
     }} */
    stats
    /** @type number */
    taille
    /** @type {{normaux: string[], cache: string | null}} */
    talents
    /** @type string[] */
    types
    /** @type number[] */
    capacites
    /** @type string */
    description
    /** @type string */
    espece
    /** @type number */
    generation

    constructor(obj) {
        if (!Number.isInteger(obj.id) || obj.id <= 0)
            throw new Error("Invalid id")

        if (obj && (obj.poids < 0.1 || obj.poids > 999.9))
            throw new Error("Invalid weight")

        // Vérification des stats
        const statsKeys = ["hp", "attack", "defense", "special_attack", "special_defense", "speed"]
        const statsValues = statsKeys.map(key => obj.stats[key])
        if (statsValues.some(val => !Number.isInteger(val) || val < 1 || val > 255))
            throw new Error("Stats values must be a integer between 1 and 255")

        const totalStats = statsValues.reduce((acc, val) => acc + val, 0)
        if (totalStats > 510)
            throw new Error("The sum of all stats must not exceed 510")

        if (obj.taille < 0.1)
            throw new Error("Invalid height")

        if (!Number.isInteger(obj.generation)) {

        }

        // Assignation des valeurs à l'instance
        this.id = obj.id
        this.nom = obj.nom
        this.nomAnglais = obj.nomAnglais
        this.nomNormalise = obj.nomNormalise
        this.poids = obj.poids
        this.sprite = obj.sprites
        this.stats = obj.stats
        this.taille = obj.taille
        this.talents = obj.talents
        this.types = obj.types
        this.capacites = obj.capacites
        this.description = obj.description
        this.espece = obj.espece
        this.generation = obj.generation
    }
}

const pkm = new Pokemon()
console.log(pkm.sprite.default)