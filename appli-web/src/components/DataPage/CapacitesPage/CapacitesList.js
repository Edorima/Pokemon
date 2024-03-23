import List from "../List"
import CapaciteCard from "./CapaciteCard";
export default function CapacitesList({
     error,
     handleNextAction,
     hasMore,
     dataList,
     loader
 }) {
    return (
        <List
            className="items"
            dataList={dataList}
            errorMessage={error}
            handleNextAction={handleNextAction}
            hasMore={hasMore}
            loader={loader}>
            {dataList.map(item => (
                <CapaciteCard
                    key={item.nomAnglais}
                    item={item}
                />
            ))}
        </List>
    )
}