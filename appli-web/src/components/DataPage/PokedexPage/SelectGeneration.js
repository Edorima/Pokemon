import SelectData from "../SelectData"

export default function SelectGeneration({onChange}) {
    return (
        <SelectData
            name='generation'
            onChange={onChange}
            defaultOptionText="Toutes les générations"
            defaultOptionValue='0'>
            {Array.from({length: 8}, (_, i) => (
                <option key={i} value={i + 1}>{`Génération ${i + 1}`}</option>
            ))}
        </SelectData>
    )
}