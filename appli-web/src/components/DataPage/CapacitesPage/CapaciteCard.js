export default function CapaciteCard({capacity}) {
    return (
        <div className="capacity-card">
            <img
                src={`/assets/types/${capacity.type}.jpg` ?? '/assets/not_found.png'}
                alt={capacity.nom}
                loading="lazy"
            />
            <span className="capacity-name">{capacity.nom}</span>
            <p>{capacity.description}</p>
        </div>
    )
}