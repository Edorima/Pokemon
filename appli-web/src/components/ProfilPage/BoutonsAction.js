export default function BoutonsAction({canSave, added, onSave, onCancel}) {
    return (
        <>
        <button onClick={onCancel}>Annuler</button>
        {!canSave && <span>
                    {added ?
                        'Vous devez choisir au ' +
                        'moins un Pokémon et au moins une capacité ' +
                        'pour chacun de vos Pokémon pour pouvoir sauvegarder.' :

                        'Vous devez au moins effectuer un changement pour pouvoir sauvegarder.'
                    }
                </span>}
        <button
            disabled={!canSave}
            onClick={() => canSave && onSave()}>
            Sauvegarder
        </button>
        </>
    )
}