function BarreRecherche({placeholder, handleOnChange, handleKeyDown}) {
    return (
        <div className="barreRecherche">
            <input
                id="champRecherche"
                type="search"
                placeholder={placeholder}
                onKeyDown={handleKeyDown}
                onChange={handleOnChange}
                size={placeholder.length}
            />
            <img src="/assets/search-normal.svg" alt="Loupe"/>
        </div>
    )
}

export default BarreRecherche