import { useState } from "react"

export default function EquipeCard({nom, initialPokemons}) {
    const [pokemons, setPokemons] = useState(initialPokemons)
    const plusButtonsCount = 6 - (pokemons.length > 6 ? 6 : pokemons.length)

    function modifierPokemon(index) {
        const updatedPokemons = [...pokemons]
        if (index >= pokemons.length) {
            // Logique pour ajouter un nouveau Pokémon
            updatedPokemons.push({nom: "Maganon", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/467.png"})
            setPokemons(updatedPokemons)
        } else {
            // Logique pour modifier un Pokémon existant
            console.log(updatedPokemons[index])
        }
    }

    return (
        <div className="equipe">
            <div className="headerEquipe">
                <span className="nomEquipe">{nom}</span>
            </div>
            <div className="pokemons">
                {pokemons.slice(0,6).map((pokemon, index) => (
                    <button key={index} className="pokemon" onClick={() => modifierPokemon(index)}>
                        <img src={pokemon.sprite} alt={pokemon.nom} width="100" height="100" draggable="false"/>
                    </button>
                ))}
                {[...Array(plusButtonsCount)].map((_, index) => (
                    <button key={`plus-${index}`} className="pokemon"
                            onClick={index === 0 ?
                                () => modifierPokemon(6-plusButtonsCount)
                                : undefined
                            }
                            disabled={index > 0}>
                        <img src="/assets/plus.svg" alt="Plus" draggable="false"/>
                    </button>
                ))}
            </div>

            {/* TODO Personnalisation */}
        </div>
    )
}