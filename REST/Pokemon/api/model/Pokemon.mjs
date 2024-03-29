export default class Pokemon {
    /** @param id {number} */
    id
    nom
    nomNormalise
    nomAnglais
    description
    types
    sprites
    espece
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