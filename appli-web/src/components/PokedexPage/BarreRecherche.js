function BarreRecherche({handleOnChange, handleKeyDown}) {
    return (
        <div className="barreRecherche">
            <input
                id="champRecherche"
                type="search"
                placeholder="Rechercher un Pokémon..."
                onKeyDown={handleKeyDown}
                onChange={handleOnChange}
            />
            <button className="boutonRecherche">
                <img src="/assets/search-normal.svg" alt="Loupe"></img>
            </button>
        </div>
    )
}

export default BarreRecherche