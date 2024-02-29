export default class Pokemon {
    id
    nom
    nomAnglais
    description
    types
    sprites
    cris
    stats
    taille
    poids
    capacites
    talents

    constructor(obj) {
        Object.assign(this, obj)
    }
}