/**
 * @param onClick {() => void}
 * @param focus {boolean}
 * @param pokemon {Object}
 */
export default function BoutonPokemon({
    onClick,
    focus = false,
    pokemon
}) {
    const getSprite = (pokemon) => {
        return pokemon.chromatique ?
            pokemon.sprites.shiny :
            pokemon.sprites.default
    }

    return (
        <button className={`pokemon${focus ? ' focus' : ''}`} onClick={onClick}>
            <img
                src={getSprite(pokemon)}
                alt={pokemon.nom}
                width="120" height="120"
                draggable="false"
            />
            {pokemon.objet &&
                <img
                    className="item-sprite"
                    src={pokemon.objet.sprite ?? '/assets/not_found.png'}
                    width="50" height="50"
                    alt={pokemon.objet.nom}
                    draggable="false"
                />}
        </button>
    )
}