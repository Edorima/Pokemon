import React from "react"

/**
 * @param handleInputChange {(ChangeEvent) => void}
 * @param fetchSearchedPkms {() => void}
 */
function BarreRecherche({handleInputChange, fetchSearchedPkms}) {
    return (
        <div className="barreRecherche">
            <input
                id="champRecherche"
                type="search"
                placeholder="Rechercher un Pokémon..."
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value !== '')
                        fetchSearchedPkms()
                }}
                onChange={handleInputChange}
            ></input>
            <button className="boutonRecherche">
                <img src="/assets/search-normal.svg" alt="Loupe"></img>
            </button>
        </div>
    )
}

export default BarreRecherche