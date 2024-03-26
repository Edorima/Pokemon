export default function BoutonsAction({canSave, onSave, onCancel}) {
    return (
        <>
        <button onClick={onCancel}>Annuler</button>
        {!canSave && <span>
                    Vous devez choisir au moins un Pokémon
                    et au moins une capacité pour chacun de vos Pokémon
                    pour pouvoir sauvegarder.
                </span>}
        <button
            disabled={!canSave}
            onClick={() => canSave && onSave()}>
            Sauvegarder
        </button>
        </>
    )
}