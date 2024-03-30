import ENDPOINTS from "./EndPoints"

const PKM_URL = 'http://localhost:8081'
const MOVE_URL = 'http://localhost:8082'
const ITEM_URL = 'http://localhost:8083'
const USER_URL = 'http://localhost:8084'

const ApiManager = {
    /**
     * @param generation {number}
     * @param type1 {string}
     * @param type2 {string}
     * @param offset {number}
     * @param limit {number}
     */
    getPkms: (generation, type1, type2, offset, limit = 0) => {
        const url = PKM_URL + ENDPOINTS.POKEMONS(generation, type1, type2, offset, limit)
        return fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
    },

    /**
     * @param searchTerm {string}
     * @param generation {number | null}
     * @param type1 {string}
     * @param type2 {string}
     * @param offset {number}
     */
    getPkmsThatStartsWith: (searchTerm, generation, type1, type2, offset) => {
        const url = PKM_URL + ENDPOINTS.POKEMONS_THAT_STARTS_WITH(
            searchTerm, generation, type1, type2, offset
        )
        return fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
    },

    /**
     * @param id {number}
     */
    getPokemonsByMove: (id) => {

        const url = PKM_URL + ENDPOINTS.POKEMONS_WITH_MOVE(id)
        return fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
    },

    /**
     * @param type {string}
     * @param categorie {string}
     * @param offset {number}
     */
    getMoves: (type, categorie, offset) => {
        const url = MOVE_URL + ENDPOINTS.MOVES(type, categorie, offset)
        return fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
    },

    /**
     * @param searchTerm {string}
     * @param type {string}
     * @param categorie {string}
     * @param offset {number}
     * @return {Promise<Response>}
     */
    getMovesThatStartsWith: (searchTerm, type, categorie, offset) => {
        const url = MOVE_URL + ENDPOINTS.MOVES_THAT_STARTS_WITH(
            searchTerm, type, categorie, offset
        )
        return fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
    },

    /**
     * @param id {number}
     */
    getMovesByPokemon: (id) => {
        const url = MOVE_URL + ENDPOINTS.MOVES_BY_POKEMON(id)
        return fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
    },

    /**
     * @param categorie {number}
     * @param offset {number}
     * @param limit {number}
     */
    getItems: (categorie, offset, limit = 0) => {
        const url = ITEM_URL + ENDPOINTS.ITEMS(categorie, offset, limit)
        return fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
    },

    /**
     * @param searchTerm {string}
     * @param categorie {number}
     * @param offset {number}
     */
    getItemsThatStartsWith: (searchTerm, categorie, offset) => {
        const url = ITEM_URL + ENDPOINTS.ITEMS_THAT_STARTS_WITH(
            searchTerm, categorie, offset
        )
        return fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
    },

    /**
     * @param username {string}
     * @param password {string}
     */
    login: (username, password) => {
        const url = USER_URL + ENDPOINTS.LOGIN()
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({pseudo: username, motDePasse: password}),
        })
    },

    /**
     * @param username {string}
     * @param password {string}
     */
    register: (username, password) => {
        const url = USER_URL + ENDPOINTS.REGISTER()
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pseudo: username, motDePasse: password }),
        })
    },

    /**
     * @param token {string}
     */
    getProfil: (token) => {
        const url = USER_URL + ENDPOINTS.PROFIL()
        return fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        })
    },

    /**
     * @param token {string}
     * @param equipe {Object}
     * @return {Promise<Response>}
     */
    addTeam: (token, equipe) => {
        const url = USER_URL + ENDPOINTS.PROFIL()
        return fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({equipe: equipe})
        })
    },

    /**
     * @param token {string}
     * @param nomActuel {string}
     * @param pokemons {Object}
     * @param nouveauNom {string}
     * @return {Promise<Response>}
     */
    editTeam: (token, nomActuel, pokemons, nouveauNom) => {
        const url = USER_URL + ENDPOINTS.PROFIL()
        return fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nomActuel: nomActuel,
                pokemons: pokemons,
                nouveauNom: nouveauNom
            })
        })
    },

    /**
     * @param token {string}
     * @param nomEquipe {string}
     * @return {Promise<Response>}
     */
    deleteTeam: (token, nomEquipe) => {
        const url = USER_URL + ENDPOINTS.PROFIL()
        return fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({nomEquipe: nomEquipe})
        })
    }
}

export default ApiManager