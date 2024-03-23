function StatBar({statValue, id}) {
    return (
        <span id={id} className="barre-stats" style={{
            width: `${statValue / 255 * 100}%`
        }}/>
    )
}

export default function PokemonStats({stats}) {
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
                    <span>{stats.hp}</span>
                    <span>{stats.attack}</span>
                    <span>{stats.defense}</span>
                    <span>{stats.special_attack}</span>
                    <span>{stats.special_defense}</span>
                    <span>{stats.speed}</span>
                </div>

                <div className="barres-stats">
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