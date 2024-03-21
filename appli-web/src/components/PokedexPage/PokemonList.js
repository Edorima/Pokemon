import InfiniteScroll from "react-infinite-scroll-component"
import PokemonCard from "./PokemonCard"

function PokemonList({
    errorMessage,
    handleNextAction,
    hasMore,
    dataList,
    loader
}) {
    return (
        <>
        {dataList.length !== 0 && !errorMessage ?
        <InfiniteScroll
            next={handleNextAction}
            hasMore={hasMore}
            loader={!errorMessage && loader}
            dataLength={dataList.length}
            className='pokemons'>
            {dataList.map(pokemon => (
                <PokemonCard
                    key={pokemon.id}
                    id={pokemon.id}
                    nom={pokemon.nom}
                    sprites={pokemon.sprites}
                    types={pokemon.types}
                    description={pokemon.description}
                    taille = {pokemon.taille}
                    poids = {pokemon.poids}
                    talents = {pokemon.talents}

                />
            ))}
        </InfiniteScroll> :
        <span>Aucun résultat</span>}
        </>
    )
}

export default PokemonList