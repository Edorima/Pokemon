function SelectGeneration({onChange}) {
    return (
        <select id="choixGen" onChange={onChange}>
            <option value="">Toutes les générations</option>
            {Array.from({length: 8}, (_, i) => (
                <option key={i} value={i + 1}>{`Génération ${i + 1}`}</option>
            ))}
        </select>
    )
}

export default SelectGeneration