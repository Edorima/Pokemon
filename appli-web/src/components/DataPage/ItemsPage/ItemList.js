import DataList from "../DataList"
import ItemCard from "./ItemCard"

export default function ItemList({
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
            {dataList.map(item => (
                <ItemCard
                    key={item.nomAnglais}
                    item={item}
                />
            ))}
        </DataList>
    )
}