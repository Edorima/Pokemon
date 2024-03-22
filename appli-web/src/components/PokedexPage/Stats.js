function Stats({stats}) {
    return (
        <>
        <h2> Statistiques </h2>
        <div className="statistique">
            <div className="nom-stats">
                <span>PV</span>
                <span>Attaque</span>
                <span>Défense</span>
                <span>Attaque Spéciale</span>
                <span>Défense Spéciale</span>
                <span>Vitesse</span>
            </div>

            <div className="valeur-stats">
                <span>60</span>
                <span>60</span>
                <span>60</span>
                <span>60</span>
                <span>60</span>
                <span>60</span>
            </div>
        </div>
        </>
    )
}

export default Stats