export function CapaciteViewer({editedMove, selector}) {

    const containerStyles = {
        backgroundImage: `url('/assets/movesSlots/${
            editedMove?.type ? editedMove.type : 'Normal'
        }.png')`,
    }

    return (
        <div className='capacite-container' style={containerStyles}>
            {editedMove && <>
                {editedMove.nom}
                <span>
                <img
                    id='type-capacite'
                    src={`/assets/types/${editedMove.type}.jpg`}
                    alt={editedMove.type}
                    width='75'
                    height='27'
                    loading='lazy'
                    draggable='false'
                />
                PP {editedMove.pp}
                </span>
            </>}
            {selector}
        </div>
    )
}