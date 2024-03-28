import SelectData from "../SelectData"

export default function SelectCategorieCapacite({onChange}) {
    const categorie = [
        'Physique', 'Spéciale', 'Statut'
    ]

    return (
        <SelectData
            name='categorieCapacite'
            onChange={onChange}
            defaultOptionText="Toutes les catégories">
            {categorie.map((value, index) => (
                <option key={index} value={value}>{value}</option>
            ))}
        </SelectData>
    )
}