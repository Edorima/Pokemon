const ENDPOINTS = {
    GET_POKEMONS: (generation, offset) =>
        `/pokemon?offset=${offset}${generation ? `&gen=${generation}` : ''}`,

    GET_POKEMONS_THAT_STARTS_WITH: (searchTerm, generation, offset) =>
        `/pokemon/startsWith/${searchTerm}?offset=${offset}${generation ? `&gen=${generation}` : ''}`,

    GET_ITEMS: (offset) =>
        `/objet?offset=${offset}`,

    GET_ITEMS_THAT_STARTS_WITH: (searchTerm, offset) =>
        `/objet/startsWith/${searchTerm}?offset=${offset}`,

    LOGIN: () => '/login',

    REGISTER: () => '/register',

    GET_PROFIL: () => '/profil',
}

export default ENDPOINTS