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


    LOGIN: () => '/login',

    REGISTER: () => '/register',

    GET_PROFIL: () => '/profil',
}

export default ENDPOINTS