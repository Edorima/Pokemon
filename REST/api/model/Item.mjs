export default class Item {
    id
    nom
    nomAnglais
    description

    constructor(obj) {
        Object.assign(this, obj)
    }
}