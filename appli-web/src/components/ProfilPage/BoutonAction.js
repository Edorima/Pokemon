export default function BoutonAction({canSave}) {
    return (
        <div className="boutonsAction">
            <button>Annuler</button>
            {!canSave && <span>
                Vous devez choisir au moins un Pokémon
                et au moins une capacité pour chacun de vos Pokémon
                pour pouvoir sauvegarder.
            </span>}
            <button disabled={!canSave}>Sauvegarder</button>
        </div>
    )
}