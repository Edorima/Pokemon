export default class Objet {
    /** @type string */
    nom

    /** @type string */
    nomAnglais

    /** @type string */
    nomNormalise

    /** @type string */
    description

    /** @type {string | null} */
    sprite

    /** @type {{id: number, nom: string}} */
    categorie

    constructor(obj) {
        if (!Objet.isNameValid(obj.nom))
            throw new Error("'nom' must be a not empty string")

        if (!Objet.isNameValid(obj.nomAnglais))
            throw new Error("'nomAnglais' must be a not empty string")

        if (!Objet.isNameValid(obj.nomNormalise))
            throw new Error("'nomNormalise' must be a not empty string")

        if (!Objet.isValidCategory(obj.categorie))
            throw new Error("'categorie' must be an object with valid 'id' and 'nom'")

        this.nom = obj.nom
        this.nomAnglais = obj.nomAnglais
        this.nomNormalise = obj.nomNormalise
        this.description = obj.description
        this.sprite = obj.sprite
        this.categorie = obj.categorie
    }

    /** @type {Map<number, string>} */
    static validCategories = new Map([
        [1, 'Boosts de statistiques'], [2, "Réducteur d'EVs"],
        [3, 'Médecine'], [4, 'Autres'],
        [5, 'Dans un état critique'], [6, 'Soin conditionnel'],
        [7, 'Protection contre un type'], [8, 'Évolution'],
        [9, 'Via Spéléologie'], [10, 'Objet porté'],
        [11, 'Choix'], [12, "Booster d'EV"],
        [13, 'Portable avec un effet négatif'], [14, 'Entraînement'],
        [15, 'Plaques'], [16, 'Spécifique à une espèce'],
        [17, 'Amélioration de type'], [18, 'Butin'],
        [19, 'Vitamines'], [20, 'Soins'],
        [21, 'Récupération de PP'], [22, 'Réanimation'],
        [23, 'Soins de Statuts'], [24, 'Pokéballs spéciales'],
        [25, 'Pokéballs standards'], [26, 'Méga-Gemmes']
    ])

    /**
     * Pour qu'un nom soit valide, il doit être une
     * chaîne de caractère et qu'elle ne soit pas vide.
     * @param value
     * @return {boolean}
     */
    static isNameValid(value) {
        return typeof value === 'string' && value.length !== 0
    }

    /**
     * L'identifiant d'une catégorie et son nom
     * doivent faire partie des catégories valides.
     * @param value {any}
     * @returns {boolean}
     */
    static isValidCategory(value) {
        return typeof value === 'object' &&
            this.validCategories.has(value.id) &&
            this.validCategories.get(value.id) === value.nom
    }
}