/**
 * Fonction de comparaison générique pour le tri de tableaux.
 * Peut être utilisée avec la méthode sort() pour trier des éléments de différents types.
 *
 * @param a {number | string | any} - Le premier élément pour la comparaison.
 * @param b {number | string | any} - Le second élément pour la comparaison.
 *
 * @returns {number} - Renvoie un nombre négatif si a doit être placé avant b,
 *                      zéro si a et b sont considérés équivalents,
 *                      ou un nombre positif si a doit être placé après b.
 *
 * Cette fonction compare directement les nombres et les chaînes de caractères
 * en utilisant des méthodes adaptées à leur type pour assurer un tri correct.
 * Pour les autres types, elle convertit les valeurs en chaînes de caractères
 * avant de les comparer, ce qui permet de gérer un large éventail de types de données,
 * mais peut conduire à des résultats de tri basés sur la représentation en chaîne
 * de ces valeurs.
 */
function sortGeneric(a, b) {
    // Comparaison de nombres
    if (typeof a === 'number' && typeof b === 'number')
        return a - b

    // Comparaison de chaînes de caractères
    if (typeof a === 'string' && typeof b === 'string')
        return a.localeCompare(b)

    // Autres types : convertis en chaînes de caractères pour le tri
    return a.toString().localeCompare(b.toString())
}

export default sortGeneric