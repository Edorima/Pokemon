import React from "react"
import InfiniteScroll from "react-infinite-scroll-component";
import PokemonCard from "./PokemonCard";

/**
 * @param errorMessage {string}
 * @param handleNextAction {() => void}
 * @param hasMore {boolean}
 * @param dataList {any[]}
 * @param loader {JSX.Element}
 */
function PokemonList({
    errorMessage,
    handleNextAction,
    hasMore,
    dataList,
    loader
}) {
    return (
        <>
        {dataList.length !== 0 ?
        !errorMessage && <InfiniteScroll
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
                image={pokemon.sprite}
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