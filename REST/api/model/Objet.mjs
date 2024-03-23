export default class Objet {
    nom
    nomAnglais
    nomNormalise
    description
    sprite

    constructor(obj) {
        Object.assign(this, obj)
    }
}