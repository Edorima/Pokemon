const ENDPOINTS = {
    GET_ALL_POKEMONS: () => '/pokemon?limit=898',

    GET_POKEMONS: (generation, type1, type2, offset) => {
        let ep = `/pokemon?offset=${offset}`
        if (generation)
            ep += `&gen=${generation}`
        if (type1) {
            ep += `&type1=${type1}`
            if (type2)
                ep += `&type2=${type2}`
        }
        return ep
    },

    GET_POKEMONS_THAT_STARTS_WITH: (searchTerm, generation, type1, type2, offset) => {
        let ep = `/pokemon/startsWith/${searchTerm}?offset=${offset}`
        if (generation)
            ep += `&gen=${generation}`
        if (type1) {
            ep += `&type1=${type1}`
            if (type2)
                ep += `&type2=${type2}`
        }
        return ep
    },

    GET_POKEMONS_BY_MOVE: (id) => `/capacite/${id}/pokemon`,

    GET_ALL_ITEMS: () => '/objet?limit=432',

    GET_ITEMS: (categorie, offset) => {
        const ep = `/objet?offset=${offset}`
        if (categorie)
            return ep + `&categorie=${categorie}`
        return ep
    },

    GET_ITEMS_THAT_STARTS_WITH: (searchTerm, categorie, offset) => {
        const ep = `/objet/startsWith/${searchTerm}?offset=${offset}`
        if (categorie)
            return ep + `&categorie=${categorie}`
        return ep
    },

    GET_MOVES: (type, categorie, offset) => {
        let ep = `/capacite?offset=${offset}`
        if (type)
            ep += `&type=${type}`
        if (categorie)
            ep += `&categorie=${categorie}`
        return ep
    },

    GET_MOVES_THAT_STARTS_WITH: (searchTerm, type, categorie, offset) => {
        let ep = `/capacite/startsWith/${searchTerm}?offset=${offset}`
        if (type)
            ep += `&type=${type}`
        if (categorie)
            ep += `&categorie=${categorie}`
        return ep
    },

    GET_MOVES_BY_POKEMON: (id) => `/pokemon/${id}/capacite`,

    LOGIN: () => '/login',

    REGISTER: () => '/register',

    PROFIL: () => '/profil',
}

export default ENDPOINTS