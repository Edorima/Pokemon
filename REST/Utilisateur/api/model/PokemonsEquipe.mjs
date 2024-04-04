import PokemonEquipe from "./PokemonEquipe.mjs"

export default class PokemonsEquipe {
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
        const pokemons = [
            obj.pokemon1, obj.pokemon2, obj.pokemon3,
            obj.pokemon4, obj.pokemon5, obj.pokemon6
        ]

        if (pokemons.every(pkm => pkm === null))
            throw new Error("must have atleast 1 non null pokemon")

        for (let i = 1; i <= 6; i++) {
            const pokemon = obj[`pokemon${i}`]

            if (pokemon === null) {
                this[`pokemon${i}`] = null
                continue
            }

            if (typeof pokemon !== 'object')
                throw new Error(`'pokemon${i}' must be an object`)

            this[`pokemon${i}`] = new PokemonEquipe(pokemon)
        }
    }
}