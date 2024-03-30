import SelectData from "./SelectData"

export default function SelectType({
    onChange,
    defaultOptionText = 'Tous les types',
    selectedValue,
    name,
    doNotInclude
}) {
    const types = [
        'Normal', 'Combat', 'Vol', 'Poison',
        'Sol', 'Roche', 'Insecte', 'Spectre',
        'Acier', 'Feu', 'Eau', 'Plante', 'Électrik',
        'Psy', 'Glace', 'Dragon', 'Ténèbres', 'Fée'
    ].filter(t => t !== doNotInclude)

    return (
        <SelectData
            selectedValue={selectedValue}
            name={name}
            onChange={onChange}
            defaultOptionText={defaultOptionText}>
            {types.map((value, index) => (
                <option key={index} value={value}>{value}</option>
            ))}
        </SelectData>
    )
}