export default class Capacite {
    id
    nom
    nomNormalise
    nomAnglais
    description
    categorie
    puissance
    precision
    pp
    type
    pokemons

    constructor(obj) {
        Object.assign(this, obj)
    }
}