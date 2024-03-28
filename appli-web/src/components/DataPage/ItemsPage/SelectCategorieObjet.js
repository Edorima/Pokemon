import SelectData from "../SelectData"

export default function SelectCategorieObjet({onChange}) {
    const map = new Map([
        [1, "Boosts de statistiques"], [2, "Réducteur d'EVs"],
        [3, "Médecine"], [4, "Autres"], [5, "Dans un état critique"],
        [6, "Soin conditionnel"], [7, "Protection contre un type"],
        [8, "Évolution"], [9, "Via Spéléologie"], [10, "Objet porté"],
        [11, "Choix"], [12, "Booster d'EV"], [13, "Portable avec un effet négatif"],
        [14, "Entraînement"], [15, "Plaques"], [16, "Spécifique à une espèce"],
        [17, "Amélioration de type"], [18, "Butin"], [19, "Vitamines"],
        [20, "Soins"], [21, "Récupération de PP"], [22, "Réanimation"],
        [23, "Soins de Statuts"], [24, "Pokéballs spéciales"],
        [25, "Pokéballs standards"], [26, "Méga-Gemmes"]
    ])

    return (
        <SelectData
            name='categorieObjet'
            onChange={onChange}
            defaultOptionText="Tous les objets">
            {[...map].map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
            ))}
        </SelectData>
    )
}