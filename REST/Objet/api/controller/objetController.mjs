"use strict"

import objetDAO from "../dao/objetDAO.mjs";

const objetController = {
    getItems: async (categorie, limit, offset) =>
        await objetDAO.getItems(categorie, limit, offset),

    findItemsThatStartsWith: async (searchTerm, categorie, limit, offset) =>
        await objetDAO.findItemsThatStartsWith(searchTerm, categorie, limit, offset)
}

export default objetController