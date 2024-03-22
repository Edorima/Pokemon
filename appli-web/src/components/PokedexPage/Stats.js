function StatBar({statValue, id}) {
    return (
        <div className="barres-stats">
            <span className="div-100">{statValue}</span>

            <span id={id} className="barre-stats" style={{
                width: `${statValue / 255 * 100}%`
            }}/>
        </div>
    )
}

function Stats({stats}) {
    return (
        <div className="container-details border-detail">
            <h2> Statistiques </h2>
            <div className="statistique">
                <div className="nom-stats">
                    <span>PV</span>
                    <span>Attaque </span>
                    <span>Défense</span>
                    <span>Attaque Spéciale</span>
                    <span>Défense Spéciale</span>
                    <span>Vitesse</span>
                </div>

                <div className="valeurs-stats">
                    <StatBar statValue={stats.hp} id="hp"/>
                    <StatBar statValue={stats.attack} id="attack"/>
                    <StatBar statValue={stats.defense} id="defense"/>
                    <StatBar statValue={stats.special_attack} id="special-attack"/>
                    <StatBar statValue={stats.special_defense} id="special-defense"/>
                    <StatBar statValue={stats.speed} id="speed"/>
                </div>
            </div>
        </div>
    )
}

export default Stats