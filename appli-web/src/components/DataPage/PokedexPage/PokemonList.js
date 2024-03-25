import PokemonCard from "./PokemonCard"
import List from "../List"

export default function PokemonList({
    error,
    handleNextAction,
    hasMore,
    dataList,
    loader
}) {
    return (
        <List
            className="pokemons"
            dataList={dataList}
            errorMessage={error}
            handleNextAction={handleNextAction}
            hasMore={hasMore}
            loader={loader}>
            {dataList.map(pokemon => (
                <PokemonCard
                    key={pokemon.id}
                    pokemon={pokemon}
                />
            ))}
        </List>
    )
}