import ENDPOINTS from "./EndPoints";
const BASE_URL = 'http://localhost:8081/api/v1'

export default class ApiManager {
    /**
     * @param page {number}
     * @returns {Promise<Response>}
     */
    static getPokemons = (page) => {
        const offset = (page - 1) * 20
        const url = BASE_URL + ENDPOINTS.GET_POKEMONS(offset)
        return fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
    }

    /**
     * @param username {string}
     * @param password {string}
     * @returns {Promise<Response>}
     */
    static login = (username, password) => {
        const url = BASE_URL + ENDPOINTS.LOGIN()
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pseudo: username, motDePasse: password }),
        })
    }

    /**
     * @param username {string}
     * @param password {string}
     * @returns {Promise<Response>}
     */
    static register = (username, password) => {
        const url = BASE_URL + ENDPOINTS.REGISTER()
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pseudo: username, motDePasse: password }),
        })
    }

    /**
     * @param token {string}
     * @returns {Promise<Response>}
     */
    static getProfil = (token) => {
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