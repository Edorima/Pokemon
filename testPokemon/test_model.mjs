"use strict"

import {expect} from "chai"
import Pokemon from "../api/model/Pokemon.mjs"

describe("Pokemon Model", () => {
    const validPokemon = {
        capacites: [
            5, 6, 9, 21, 24, 25, 29, 34, 36, 38, 39,
            45, 57, 66, 68, 69, 70, 84, 85, 86, 87,
            91, 92, 97, 98, 99, 102, 104, 111, 113,
            115, 117, 129, 130, 148, 156, 164, 168,
            173, 174, 179, 182, 186, 189, 192, 197,
            203, 204, 205, 207, 209, 213, 214, 216,
            218, 223, 227, 231, 237, 240, 249, 253,
            263, 264, 268, 270, 280, 282, 283, 290,
            313, 324, 343, 344, 347, 351, 363, 364,
            374, 393, 417, 435, 445, 447, 451, 486,
            496, 497, 521, 527, 528, 574, 577, 583,
            589, 590, 598, 604, 609, 673, 804
        ],
        description: "Il lui arrive de remettre d’aplomb\nun Pikachu allié en lui envoyant\nune décharge électrique.",
        espece: "Pokémon Souris",
        generation: 1,
        id: 25,
        nom: "Pikachu",
        nomAnglais: "pikachu",
        nomNormalise: "pikachu",
        poids: 6,
        sprites: {
            default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
            shiny: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/25.png"
        },
        stats: {
            hp: 35,
            attack: 55,
            defense: 40,
            special_attack: 50,
            special_defense: 50,
            speed: 90
        },
        taille: 0.4,
        talents: {
            normaux: ["Statik"],
            cache: "Paratonnerre"
        },
        types: ["Électrik"]
    }

    const expectErrorOnPkmCreate = (attr, value, expectedMessage) => {
        try {
            new Pokemon({...validPokemon, [attr]: value})
            expect.fail("Should have thrown an error")
        } catch (e) {
            expect(e.message).to.equal(expectedMessage)
        }
    }

    it('should fail to create a Pokemon whose id is invalid', () => {
        const idErrorMessage = "Id must be an integer greater or equal to 1"
        expectErrorOnPkmCreate('id', 0, idErrorMessage)
        expectErrorOnPkmCreate('id', NaN, idErrorMessage)
    })

    it("should fail to create a Pokemon when 'nom' is an empty string", () => {
        expectErrorOnPkmCreate('nom', '', "'nom' must be a not empty string")
    })

    it("should fail to create a Pokemon when 'nomAnglais' is an empty string",  () => {
        expectErrorOnPkmCreate('nomAnglais', '', "'nomAnglais' must be a not empty string")
    })

    it("should fail to create a Pokemon when 'nomNormalise' is an empty string", () => {
        expectErrorOnPkmCreate('nomNormalise', '', "'nomNormalise' must be a not empty string")
    })

    it("should fail to create a Pokemon when 'description' is not a string", () => {
        const descriptionErrorMessage = "'description' must be a string"
        expectErrorOnPkmCreate('description', null, descriptionErrorMessage)
        expectErrorOnPkmCreate('description', {}, descriptionErrorMessage)
    })

    it("should fail to create a Pokemon when 'poids' is invalid", () => {
        const poidsErrorMessage = "Weight must be a number between 0.1 and 999.9"
        expectErrorOnPkmCreate('poids', 0, poidsErrorMessage)
        expectErrorOnPkmCreate('poids', 1000, poidsErrorMessage)
    })

    it("should fail to create a Pokemon when 'sprites' is invalid", () => {
        const spritesErrorMessage = "'sprites' must be an object"
        expectErrorOnPkmCreate('sprites', null, spritesErrorMessage)
        expectErrorOnPkmCreate('sprites', '', spritesErrorMessage)

        expectErrorOnPkmCreate('sprites',
            {default: null},
            "'default' must be a string"
        )
        expectErrorOnPkmCreate('sprites',
            {default: 'default', shiny: null},
            "'shiny' must be a string"
        )
    })

    it("should fail to create a Pokemon when 'taille' is invalid", () => {
        const tailleErrorMessage = "Height must be a number greater or equal to 0.1"
        expectErrorOnPkmCreate('taille', 0, tailleErrorMessage)
    })

    it("should fail to create a Pokemon when 'talents' is invalid", () => {
        const talentsErrorMessage = "'talents' must be an object"
        expectErrorOnPkmCreate('talents', null, talentsErrorMessage)
        expectErrorOnPkmCreate('talents', '', talentsErrorMessage)

        expectErrorOnPkmCreate(
            'talents',
            {normaux: ['talent', 1]},
            "'normaux' must be an array of strings"
        )

        expectErrorOnPkmCreate(
            'talents',
            {normaux: [], cache: 1},
            "'cache' must be a string or null"
        )
    })

    it("should fail to create a Pokemon when 'stats' is not an object", () => {
        expectErrorOnPkmCreate('stats', null, "'stats' must be an object")
    })

    it('should fail to create a Pokemon when a stat is not between 1 and 255', () => {
        const statsKeys = ["hp", "attack", "defense", "special_attack", "special_defense", "speed"]
        const statsErrorMessage = "Stats values must be a integer between 1 and 255"
        for (const key of statsKeys) {
            expectErrorOnPkmCreate('stats', {...validPokemon.stats, [key]: 0}, statsErrorMessage)
            expectErrorOnPkmCreate('stats', {...validPokemon.stats, [key]: 256}, statsErrorMessage)
        }
    })

    it('should fail to create a Pokemon with an invalid generation', ()  => {
        const generationErrorMessage = "Generation must be a integer greater or equal to 1"
        expectErrorOnPkmCreate('generation', 0, generationErrorMessage)
    })

    it('should fail to create a Pokemon with an invalid types array', () => {
        const typesErrorMessage = "Types must be an array of atleast one valid type and not more than 2"
        expectErrorOnPkmCreate('types', null, typesErrorMessage)
        expectErrorOnPkmCreate('types', [], typesErrorMessage)
        expectErrorOnPkmCreate('types', ['t1', 't2', 't3'], typesErrorMessage)
        expectErrorOnPkmCreate('types', ['Ombre'], typesErrorMessage)
    })

    it("should fail to create a Pokemon with an invalid moves array", () => {
        const capacitesErrorMessage = "'capacites' must be an array of numbers"
        expectErrorOnPkmCreate('capacites', null, capacitesErrorMessage)
        expectErrorOnPkmCreate('capacites', [1, 'test', 3], capacitesErrorMessage)
    })

    it("should fail to create a Pokemon when 'espece' is not a string", () => {
        const especeErrorMessage = "'espece' must be a string"
        expectErrorOnPkmCreate('espece', null, especeErrorMessage)
        expectErrorOnPkmCreate('espece', {}, especeErrorMessage)
        expectErrorOnPkmCreate('espece', 10, especeErrorMessage)
    })

    it('should be fine to create a valid Pokemon', () => {
        try {
            new Pokemon(validPokemon)
        } catch(e) {
            expect.fail(`Should have not thrown an error. Error: ${e.message}`)
        }
    })
})