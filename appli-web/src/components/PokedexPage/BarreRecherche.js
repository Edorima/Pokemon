import React from "react"

function BarreRecherche({handleOnChange, handleKeyDown}) {
    return (
        <div className="barreRecherche">
            <input
                id="champRecherche"
                type="search"
                placeholder="Rechercher un Pokémon..."
                onKeyDown={handleKeyDown}
                onChange={handleOnChange}
            ></input>
            <button className="boutonRecherche">
                <img src="/assets/search-normal.svg" alt="Loupe"></img>
            </button>
        </div>
    )
}

export default BarreRecherche