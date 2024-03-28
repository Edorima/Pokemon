export default function BoutonsAction({saveMessage, onSave, onCancel}) {
    const canSave = !saveMessage

    return (
        <>
            <button onClick={onCancel}>Annuler</button>
            {!canSave && <span>{saveMessage}</span>}
            <button
                disabled={!canSave}
                onClick={() => canSave && onSave()}>
                Sauvegarder
            </button>
        </>
    )
}