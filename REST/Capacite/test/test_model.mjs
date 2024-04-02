"use strict"

import {expect} from "chai"
import Capacite from "../api/model/Capacite.mjs"

describe("Capacité Model", () => {
    const validMove = {
        categorie: "Physique",
        description: "Une attaque deux fois plus puissante si le\nlanceur a été blessé par l’ennemi durant\nle tour.",
        id: 419,
        nom: "Avalanche",
        nomAnglais: "avalanche",
        nomNormalise: "avalanche",
        pokemons: [
            "blastoise", "nidoqueen", "nidoking", "slowpoke",
            "slowbro", "seel", "dewgong", "shellder", "cloyster",
            "rhydon", "kangaskhan", "starmie", "jynx", "gyarados",
            "lapras", "articuno", "mewtwo", "mew", "feraligatr",
            "wooper", "quagsire", "slowking", "sneasel", "teddiursa"
        ],
        pp: 10,
        precision: 100,
        puissance: 60,
        type: "Glace"
    }

    const expectErrorOnMoveCreate = (attr, value, expectedMessage) => {
        try {
            new Capacite({...validMove, [attr]: value})
            expect.fail("Should have thrown an error")
        } catch (e) {
            expect(e.message).to.equal(expectedMessage)
        }
    }

    const idErrorMessage = "Id must be an integer greater or equal to 1"
    it('should fail to create a Move whose id is not an integer', () => {
        expectErrorOnMoveCreate('id', NaN, idErrorMessage)
    })

    it('should fail to create a Move whose id is 0', () => {
        expectErrorOnMoveCreate('id', 0, idErrorMessage)
    })

    it("should fail to create a Move when 'nom' is an empty string", () => {
        expectErrorOnMoveCreate('nom', '', "'nom' must be a not empty string")
    })

    it("should fail to create a Move when 'nomAnglais' is an empty string",  () => {
        expectErrorOnMoveCreate('nomAnglais', '', "'nomAnglais' must be a not empty string")
    })

    it("should fail to create a Move when 'nomNormalise' is an empty string", () => {
        expectErrorOnMoveCreate('nomNormalise', '', "'nomNormalise' must be a not empty string")
    })

    it('should fail to create a Move with invalid PP', () => {
        const ppErrorMessage = "PP must be an integer greater or equal to 1"
        expectErrorOnMoveCreate('pp', 0, ppErrorMessage)
    })

    it('should fail to create a Move with invalid precision', () => {
        const precisionErrorMessage = "Precision must be a percentage or null"
        expectErrorOnMoveCreate('precision', -1, precisionErrorMessage)
        expectErrorOnMoveCreate('precision', 101, precisionErrorMessage)
    })

    it('should be fine to create a Move with a null precision', () => {
        try {
            new Capacite({...validMove, precision: null})
        } catch {
            expect.fail("Should have not thrown an error")
        }
    })

    it('should fail to create a Move with invalid power', () => {
        const powerErrorMessage = "Power must be an integer greater or equal to 1"
        expectErrorOnMoveCreate('puissance', 0, powerErrorMessage)
    })

    it('should be fine to create a Move with a null power', () => {
        try {
            new Capacite({...validMove, puissance: null})
        } catch {
            expect.fail("Should have not thrown an error")
        }
    })

    it('should fail to create a Move with an invalid type', () => {
        const typeErrorMessage = "Type must be a valid one"
        expectErrorOnMoveCreate('type', 'Ombre', typeErrorMessage)
    })

    it('should fail to create a Move with an invalid category', () => {
        const categorieErrorMessage = "Category must be a valid one."
        expectErrorOnMoveCreate('categorie', 'Catégorie Inconnu', categorieErrorMessage)
    })

    it('should be fine to create a valid Move', () => {
        try {
            new Capacite(validMove)
        } catch {
            expect.fail("Should have not thrown an error")
        }
    })
})