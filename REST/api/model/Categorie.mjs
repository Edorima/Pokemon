class Categorie {
    static #instance = 1
    id = Categorie.#instance
    nom
    constructor(nom) {
        this.nom = nom
        Categorie.#instance++
    }
}

const categorieMap = new Map([
    ['stat-boosts', new Categorie("Boosts de statistiques")],
    ['effort-drop', new Categorie("Réducteur d'EVs")],
    ['medicine', new Categorie("Médecine")],
    ['other', new Categorie("Autres")],
    ['in-a-pinch', new Categorie("Dans un état critique")],
    ['picky-healing', new Categorie("Soin conditionnel")],
    ['type-protection', new Categorie("Protection contre un type")],
    ['evolution', new Categorie("Évolution")],
    ['spelunking', new Categorie("Via Spéléologie")],
    ['held-items', new Categorie("Objet porté")],
    ['choice', new Categorie("Choix")],
    ['effort-training', new Categorie("Booster d'EV")],
    ['bad-held-items', new Categorie("Portable avec un effet négatif")],
    ['training', new Categorie("Entraînement")],
    ['plates', new Categorie("Plaques")],
    ['species-specific', new Categorie("Spécifique à une espèce")],
    ['type-enhancement', new Categorie("Amélioration de type")],
    ['loot', new Categorie("Butin")],
    ['vitamins', new Categorie("Vitamines")],
    ['healing', new Categorie("Soins")],
    ['pp-recovery', new Categorie("Récupération de PP")],
    ['revival', new Categorie("Réanimation")],
    ['status-cures', new Categorie("Soins de Statuts")],
    ['special-balls', new Categorie("Pokéballs spéciales")],
    ['standard-balls', new Categorie("Pokéballs standards")],
    ['mega-stones', new Categorie("Méga-Gemmes")]
])

export default categorieMap