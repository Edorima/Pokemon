function Stats({stats}) {
    const colors = ["#A8FFA0", "#FFA0A0", "#FDFFA0", "#FFD4A0", "#F6CC5E", "#B5FFFB"];
    return (
        <>
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

                <div className="valeur-stats">
                    {stats.map((stat, index) => (
                        <span key={index}>{stat.base_stat}</span>
                    ))}
                </div>


                <div className="barre-stats">
                    {stats.map((stat, index) => (
                        <span
                            key={index}
                            className="barre-de_stats"
                            style={{
                                width: `${stat.base_stat / 255 *100 }%`,
                                backgroundColor: colors[index]
                            }}
                        ></span>
                    ))}
                </div>

            </div>
        </>
    )
}

export default Stats