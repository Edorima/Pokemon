export default class PokemonTalents {
    /** @type string[] */
    normaux

    /** @type {string | null} */
    cache

    constructor(obj) {
        if (!Array.isArray(obj.normaux) || obj.normaux.some(t => typeof t !== 'string'))
            throw new Error("'normaux' must be an array of strings")

        if (obj.cache !== null && typeof obj.cache !== 'string')
            throw new Error("'cache' must be a string or null")

        this.normaux = obj.normaux
        this.cache = obj.cache
    }
}