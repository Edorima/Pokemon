const ENDPOINTS = {
    POKEMONS: (generation, type1, type2, offset, limit) => {
        let ep = `/pokemon?offset=${offset}`
        if (limit)
            ep += `&limit=${limit}`
        if (generation)
            ep += `&gen=${generation}`
        if (type1) {
            ep += `&type1=${type1}`
            if (type2)
                ep += `&type2=${type2}`
        }
        return ep
    },

    POKEMONS_THAT_STARTS_WITH: (searchTerm, generation, type1, type2, offset) => {
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

    POKEMONS_WITH_MOVE: (id) => `/pokemon/withMove/${id}`,

    ITEMS: (categorie, offset) => {
        const ep = `/objet?offset=${offset}`
        if (categorie)
            return ep + `&categorie=${categorie}`
        return ep
    },

    ITEMS_THAT_STARTS_WITH: (searchTerm, categorie, offset) => {
        const ep = `/objet/startsWith/${searchTerm}?offset=${offset}`
        if (categorie)
            return ep + `&categorie=${categorie}`
        return ep
    },

    MOVES: (type, categorie, offset) => {
        let ep = `/capacite?offset=${offset}`
        if (type)
            ep += `&type=${type}`
        if (categorie)
            ep += `&categorie=${categorie}`
        return ep
    },

    MOVES_THAT_STARTS_WITH: (searchTerm, type, categorie, offset) => {
        let ep = `/capacite/startsWith/${searchTerm}?offset=${offset}`
        if (type)
            ep += `&type=${type}`
        if (categorie)
            ep += `&categorie=${categorie}`
        return ep
    },

    MOVES_BY_POKEMON: (id) => `/capacite/ofPokemon/${id}`,

    LOGIN: () => '/login',

    REGISTER: () => '/register',

    PROFIL: () => '/profil',
}

export default ENDPOINTS