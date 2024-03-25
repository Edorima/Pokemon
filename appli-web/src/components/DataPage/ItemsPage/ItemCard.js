export default function ItemCard({item}) {
    return (
        <div className="item-card">
            <img
                src={item.sprite ?? '/assets/not_found.png'}
                alt={item.nom}
                width='120'
                height='120'
                loading="lazy"
            />
            <span className="item-name">{item.nom}</span>
            <p>{item.description}</p>
        </div>
    )
}