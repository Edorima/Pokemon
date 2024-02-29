export default class Capacite {
    id
    nom
    description
    categorie
    puissance
    precision
    pp
    type

    constructor(obj) {
        Object.assign(this, obj)
    }
}