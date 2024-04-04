export default class PokemonStats {
    /** @type number */
    hp

    /** @type number */
    attack

    /** @type number */
    defense

    /** @type number */
    special_attack

    /** @type number */
    special_defense

    /** @type number */
    speed

    constructor(obj) {
        if (!PokemonStats.areStatsValid(obj))
            throw new Error("Stats values must be a integer between 1 and 255")

        this.hp = obj.hp
        this.attack = obj.attack
        this.defense = obj.defense
        this.special_attack = obj.special_attack
        this.special_defense = obj.special_defense
        this.speed = obj.speed
    }

    /**
     * Cette fonction vérifie que toute les stats
     * sont des entiers entre 1 et 255
     * @param stats {any}
     * @return {boolean}
     */
    static areStatsValid(stats) {
        const statsKeys = ["hp", "attack", "defense", "special_attack", "special_defense", "speed"]

        for (const key of statsKeys) {
            const value = stats[key]
            if (!Number.isInteger(value) || value < 1 || value > 255) {
                // La valeur de la stat n'est pas dans l'intervalle autorisé
                return false
            }
        }

        return true // Toutes les stats sont valides
    }
}