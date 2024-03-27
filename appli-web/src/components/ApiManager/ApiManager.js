import ENDPOINTS from "./EndPoints"
const BASE_URL = 'http://localhost:8081/api/v1'

const ApiManager = {
    getAllPkms: () => {
        const url = BASE_URL + ENDPOINTS.GET_ALL_POKEMONS()
        return fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
    },

    /**
     * @param generation {number}
     * @param offset {number}
     */
    getPkms: (generation, offset) => {
        const url = BASE_URL + ENDPOINTS.GET_POKEMONS(generation, offset)
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
     * @param offset {number}
     */
    getPkmsThatStartsWith: (searchTerm, generation, offset) => {
        const url = BASE_URL + ENDPOINTS.GET_POKEMONS_THAT_STARTS_WITH(
            searchTerm, generation, offset
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

        const url = BASE_URL + ENDPOINTS.GET_POKEMONS_BY_MOVE(id)
        return fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
    },

    getAllItems: () => {
        const url = BASE_URL + ENDPOINTS.GET_ALL_ITEMS()
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
     */
    getItems: (categorie, offset) => {
        const url = BASE_URL + ENDPOINTS.GET_ITEMS(categorie, offset)
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
        const url = BASE_URL + ENDPOINTS.GET_ITEMS_THAT_STARTS_WITH(
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
     * @param type {string}
     * @param categorie {string}
     * @param offset {number}
     */
    getMoves: (type, categorie, offset) => {
        const url = BASE_URL + ENDPOINTS.GET_MOVES(type, categorie, offset)
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
        const url = BASE_URL + ENDPOINTS.GET_MOVES_THAT_STARTS_WITH(
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
        const url = BASE_URL + ENDPOINTS.GET_MOVES_BY_POKEMON(id)
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
        const url = BASE_URL + ENDPOINTS.LOGIN()
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
        const url = BASE_URL + ENDPOINTS.REGISTER()
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
        const url = BASE_URL + ENDPOINTS.PROFIL()
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
        const url = BASE_URL + ENDPOINTS.PROFIL()
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
     * @param equipe {Object}
     * @return {Promise<Response>}
     */
    editTeam: (token, equipe) => {
        const url = BASE_URL + ENDPOINTS.PROFIL()
        return fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({equipe: equipe})
        })
    },

    /**
     * @param token {string}
     * @param nomEquipe {string}
     * @return {Promise<Response>}
     */
    deleteTeam: (token, nomEquipe) => {
        const url = BASE_URL + ENDPOINTS.PROFIL()
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