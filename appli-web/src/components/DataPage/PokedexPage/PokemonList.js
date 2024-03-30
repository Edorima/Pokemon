import PokemonCard from "./PokemonCard"
import DataList from "../DataList"

export default function PokemonList({
    error,
    handleNextAction,
    hasMore,
    dataList,
    loader
}) {
    return (
        <DataList
            className="list"
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
        </DataList>
    )
}