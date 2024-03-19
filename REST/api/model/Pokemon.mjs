export default class Pokemon {
    id
    nom
    nomNormalise
    nomAnglais
    description
    types
    sprite
    generation
    stats
    taille
    poids
    capacites
    talents

    constructor(obj) {
        Object.assign(this, obj)
    }
}