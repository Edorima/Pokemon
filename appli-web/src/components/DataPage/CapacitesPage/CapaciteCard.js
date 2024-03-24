export default function CapaciteCard({item}) {
    return (
        <div className="item-card">
            <img
                src={"/assets/types/" + item.type +".jpg" ?? '/assets/not_found.png'}
                alt={item.nom}
                loading="lazy"
            />
            <span className="item-name">{item.nom}</span>
            <p>{item.description}</p>
        </div>
    )
}