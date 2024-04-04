export default class ObjetCategorie {
    /** @type number */
    id

    /** @type string */
    nom

    constructor(obj) {
        if (!ObjetCategorie.isValidCategory(obj))
            throw new Error("'id' or/and 'nom' must be valid")

        this.id = obj.id
        this.nom = obj.nom
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
     * L'identifiant d'une catégorie et son nom
     * doivent faire partie des catégories valides.
     * @param value {any}
     * @returns {boolean}
     */
    static isValidCategory(value) {
        return this.validCategories.has(value.id) &&
            this.validCategories.get(value.id) === value.nom
    }
}