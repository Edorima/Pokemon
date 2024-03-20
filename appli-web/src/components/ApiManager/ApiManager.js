import ENDPOINTS from "./EndPoints";
const BASE_URL = 'http://localhost:8081/api/v1'

const ApiManager = {
    /**
     * @param generation {number | null}
     * @param offset {number}
     * @returns {Promise<Response>}
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
     * @returns {Promise<Response>}
     */
    getPkmsThatStartsWith: (searchTerm, generation, offset) => {
        const url = BASE_URL + ENDPOINTS.GET_POKEMONS_THAT_STARTS_WITH(searchTerm, generation, offset)
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
     * @returns {Promise<Response>}
     */
    login: (username, password) => {
        const url = BASE_URL + ENDPOINTS.LOGIN()
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pseudo: username, motDePasse: password }),
        })
    },

    /**
     * @param username {string}
     * @param password {string}
     * @returns {Promise<Response>}
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
     * @returns {Promise<Response>}
     */
    getProfil: (token) => {
        const url = BASE_URL + ENDPOINTS.GET_PROFIL()
        return fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
    }
}

export default ApiManager