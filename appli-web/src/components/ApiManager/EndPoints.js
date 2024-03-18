const ENDPOINTS = {
    GET_POKEMONS: (offset) => `/pokemon?offset=${offset}`,

    GET_POKEMONS_THAT_STARTS_WITH: (searchTerm, offset) => `/pokemon/startsWith/${searchTerm}?offset=${offset}`,

    GET_POKEMONS_BY_GEN: (gen) => `/pokemon/gen/${gen}`,

    LOGIN: () => '/login',

    REGISTER: () => '/register',

    GET_PROFIL: () => '/profil',
}

export default ENDPOINTS