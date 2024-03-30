export default class Objet {
    nom
    nomAnglais
    nomNormalise
    description
    sprite
    categorie

    constructor(obj) {
        Object.assign(this, obj)
    }
}