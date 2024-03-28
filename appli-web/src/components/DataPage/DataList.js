import InfiniteScroll from "react-infinite-scroll-component"

export default function DataList({
    error,
    handleNextAction,
    hasMore,
    dataList,
    loader,
    className,
    children
}) {
    return (
        <>
        {dataList.length !== 0 && !error ?
            <InfiniteScroll
                next={handleNextAction}
                hasMore={hasMore}
                loader={!error && loader}
                dataLength={dataList.length}
                className={className}>
                {children}
            </InfiniteScroll> :
            <>Aucun résultat</>}
        </>
    )
}