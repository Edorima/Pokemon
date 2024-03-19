import React from "react"

/**
 * @param handleInputChange {(ChangeEvent) => void}
 * @param fetchSearchedPkms {() => void}
 * @param canFetch {boolean}
 */
function BarreRecherche({handleInputChange, fetchSearchedPkms, canFetch}) {
    return (
        <div className="barreRecherche">
            <input
                id="champRecherche"
                type="search"
                placeholder="Rechercher un Pokémon..."
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && canFetch)
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