import React from "react"
import InfiniteScroll from "react-infinite-scroll-component";
import PokemonCard from "./PokemonCard";

/**
 * @param errorMessage {string}
 * @param handleNextAction {() => void}
 * @param hasMore {boolean}
 * @param dataList {any[]}
 * @param loader {React.ReactHTMLElement}
 */
function PokemonsList({
    errorMessage,
    handleNextAction,
    hasMore,
    dataList,
    loader
}) {
    return (
        <>
        {!errorMessage && <InfiniteScroll
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
                image={pokemon.image}
                types={pokemon.types}
                description={pokemon.description}
            />
        ))}
        </InfiniteScroll>}
        </>
    )
}

export default PokemonsList