import PokemonsEquipe from "./PokemonsEquipe.mjs"

export default class Equipe {
    /** @type string */
    nom

    /** @type PokemonsEquipe */
    pokemons

    constructor(obj) {
        if (obj.nom === null || typeof obj.nom !== 'string')
            throw new Error("'nom' must be a string")

        if (obj.pokemons === null || typeof obj.pokemons !== 'object')
            throw new Error("'pokemons' must be an object")

        this.nom = obj.nom
        this.pokemons = new PokemonsEquipe(obj.pokemons)
    }
}