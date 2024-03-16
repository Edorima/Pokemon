const ENDPOINTS = {
    GET_POKEMONS: () => `/pokemon`,

    /** @param nameOrId {string | number} */
    GET_POKEMON: (nameOrId) => `/pokemon/${nameOrId}`,

    GET_POKEMONS_BY_TYPE: (type) => `/pokemon/type/${type}`,

    GET_POKEMONS_BY_TYPES: (type1, type2) =>
        `/pokemon/type/${type1}/${type2}`,

    GET_POKEMONS_BY_GEN: (gen) => `/pokemon/gen/${gen}`,

    /** @param nameOrId {string | number} */
    GET_CAPACITE: (nameOrId) => `/capacite/${nameOrId}`,

    GET_ITEM: (name) => `/item/${name}`,

    LOGIN: () => '/login',

    REGISTER: () => '/register',

    GET_PROFIL: () => '/profil',
}

export default ENDPOINTS