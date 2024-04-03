"use strict"

import {expect} from "chai"
import Objet from "../api/model/Objet.mjs"

describe('Objet Model', () => {
    const validItem = {
        categorie: {id: 26, nom: "Méga-Gemmes"},
        description: "Une variété de Méga-Gemme." +
            "\nTenue par un Drattak, elle lui permet de" +
            "\nméga-évoluer durant un combat.",
        nom: "Drattakite",
        nomAnglais: "salamencite",
        nomNormalise: "drattakite",
        sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/salamencite.png"
    }

    const expectErrorOnItemCreate = (attr, value, expectedMessage) => {
        try {
            new Objet({...validItem, [attr]: value})
            expect.fail("Should have thrown an error")
        } catch (e) {
            expect(e.message).to.equal(expectedMessage)
        }
    }

    it("should fail to create an Item when 'nom' is an empty string", () => {
        expectErrorOnItemCreate('nom', '', "'nom' must be a not empty string")
    })

    it("should fail to create an Item when 'nomAnglais' is an empty string",  () => {
        expectErrorOnItemCreate('nomAnglais', '', "'nomAnglais' must be a not empty string")
    })

    it("should fail to create an Item when 'nomNormalise' is an empty string", () => {
        expectErrorOnItemCreate('nomNormalise', '', "'nomNormalise' must be a not empty string")
    })

    it('should fail to create an Item when category is invalid', () => {
        const categorieErrorMessage = "'categorie' must be an object with valid 'id' and 'nom'"
        expectErrorOnItemCreate(
            'categorie',
            {id: 1, nom: 'Categorie invalide'},
            categorieErrorMessage
        )
    })

    it('should be fine to create a valid Item', () => {
        try {
            new Objet(validItem)
        } catch {
            expect.fail("Should have not thrown an error")
        }
    })
})