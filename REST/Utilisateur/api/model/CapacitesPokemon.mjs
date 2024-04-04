import CapacitePokemon from "./CapacitePokemon.mjs";

export default class CapacitesPokemon {
    /** @type {CapacitePokemon | null} */
    capacite1

    /** @type {CapacitePokemon | null} */
    capacite2

    /** @type {CapacitePokemon | null} */
    capacite3

    /** @type {CapacitePokemon | null} */
    capacite4

    constructor(obj) {
        const capacites = [
            obj.capacite1, obj.capacite2,
            obj.capacite3, obj.capacite4
        ]

        if (capacites.every(cap => cap === null))
            throw new Error("must have atleast 1 non null move")

        for (let i = 1; i <= 4; i++) {
            const move = obj[`capacite${i}`]

            if (move === null) {
                this[`capacite${i}`] = null
                continue
            }

            if (typeof move !== 'object')
                throw new Error(`'capacite${i}' must be an object`)

            this[`capacite${i}`] = new CapacitePokemon(move)
        }
    }
}