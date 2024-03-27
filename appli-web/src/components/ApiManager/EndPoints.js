const ENDPOINTS = {
    GET_POKEMONS: (generation, offset) => {
        const ep = `/pokemon?offset=${offset}`
        if (generation)
            return ep + `&gen=${generation}`
        return ep
    },

    GET_POKEMONS_THAT_STARTS_WITH: (searchTerm, generation, offset) => {
        const ep = `/pokemon/startsWith/${searchTerm}?offset=${offset}`
        if (generation)
            return ep + `&gen=${generation}`
        return ep
    },

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

    GET_POKEMONS_BY_MOVE: (id) => {
        return `/capacite/${id}/pokemons`
    },


    GET_MOVES_THAT_STARTS_WITH: (searchTerm, type, categorie, offset) => {
        let ep = `/capacite/startsWith/${searchTerm}?offset=${offset}`
        if (type)
            ep += `&type=${type}`
        if (categorie)
            ep += `&categorie=${categorie}`
        return ep
    },

    LOGIN: () => '/login',

    REGISTER: () => '/register',

    PROFIL: () => '/profil',
}

export default ENDPOINTS