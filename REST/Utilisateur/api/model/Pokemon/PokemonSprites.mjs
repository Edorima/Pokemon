export default class PokemonSprites {
    /** @type string */
    default

    /** @type string */
    shiny

    constructor(obj) {
        if (obj.default === null || typeof obj.default !== 'string')
            throw new Error("'default' must be a string")

        if (obj.shiny === null || typeof obj.shiny !== 'string')
            throw new Error("'shiny' must be a string")

        this.default = obj.default
        this.shiny = obj.shiny
    }
}