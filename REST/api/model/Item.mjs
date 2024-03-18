export default class Item {
    nom
    nomAnglais
    description
    categorie

    constructor(obj) {
        Object.assign(this, obj)
    }
}