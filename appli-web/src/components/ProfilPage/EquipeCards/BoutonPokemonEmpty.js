export default function BoutonPokemonEmpty({
    onClick = () => false,
    focus = false,
    disabled,
    showPlus = false
}) {
    return (
        <button
            onClick={onClick}
            className={`pokemon${focus ? ' focus' : ''}`}
            disabled={disabled}>
            {showPlus &&
            <img
                width="120" height="120"
                src="/assets/plus.svg"
                alt="Plus"
                draggable="false"
            />}
        </button>
    )
}