import List from "../List"
import CapaciteCard from "./CapaciteCard"
export default function CapacitesList({
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
            {dataList.map(capacity => (
                <CapaciteCard
                    key={capacity.nomAnglais}
                    capacity={capacity}
                />
            ))}
        </List>
    )
}