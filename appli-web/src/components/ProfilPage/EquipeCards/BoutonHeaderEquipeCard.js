export default function BoutonHeaderEquipeCard({className, disabled, onClick, src, alt}) {
    return (
        <button
            className={className}
            disabled={disabled}
            onClick={() => !disabled && onClick()}>
            <img src={src} alt={alt}/>
        </button>
    )
}