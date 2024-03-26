export function CapaciteViewer({editedMove, selector}) {
    return (
        <div className='capacite-container'
             style={{backgroundImage: "url('/assets/AttackSlotPokemon.png')"}}>
            {editedMove ?
                <>
                    {editedMove.nom}
                    <span>
                    <img
                        id='type-capacite'
                        src={`/assets/types/${editedMove.type}.jpg`}
                        alt={editedMove.type}
                        width='75'
                        height='27'
                    />
                    PP {editedMove.pp}
                </span>
                </> : 'Aucune Attaque'}

            {selector}
        </div>
    )
}