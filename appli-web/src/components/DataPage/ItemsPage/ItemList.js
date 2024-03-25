import List from "../List"
import ItemCard from "./ItemCard"

export default function ItemList({
    error,
    handleNextAction,
    hasMore,
    dataList,
    loader
}) {
    return (
        <List
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
        </List>
    )
}