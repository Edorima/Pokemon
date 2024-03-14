export default class Type {
    id
    nom
    nomAnglais
    capacites = []
    pokemons = []
    constructor(obj) {
        Object.assign(this, obj)
    }
}

/** @type {Map<string, Type>} */
export const typeMap = new Map()
const allTypes = [
    new Type({id: 1, nom: "Normal", nomAnglais: "normal"}),
    new Type({id: 2, nom: "Combat", nomAnglais: "fighting"}),
    new Type({id: 3, nom: "Vol", nomAnglais: "flying"}),
    new Type({id: 4, nom: "Poison", nomAnglais: "poison"}),
    new Type({id: 5, nom: "Sol", nomAnglais: "ground"}),
    new Type({id: 6, nom: "Roche", nomAnglais: "rock"}),
    new Type({id: 7, nom: "Insecte", nomAnglais: "bug"}),
    new Type({id: 8, nom: "Spectre", nomAnglais: "ghost"}),
    new Type({id: 9, nom: "Acier", nomAnglais: "steel"}),
    new Type({id: 10, nom: "Feu", nomAnglais: "fire"}),
    new Type({id: 11, nom: "Eau", nomAnglais: "water"}),
    new Type({id: 12, nom: "Plante", nomAnglais: "grass"}),
    new Type({id: 13, nom: "Électrik", nomAnglais: "electric"}),
    new Type({id: 14, nom: "Psy", nomAnglais: "psychic"}),
    new Type({id: 15, nom: "Glace", nomAnglais: "ice"}),
    new Type({id: 16, nom: "Dragon", nomAnglais: "dragon"}),
    new Type({id: 17, nom: "Ténèbres", nomAnglais: "dark"}),
    new Type({id: 18, nom: "Fée", nomAnglais: "fairy"})
]

for (const type of allTypes)
    typeMap.set(type.nomAnglais, type)