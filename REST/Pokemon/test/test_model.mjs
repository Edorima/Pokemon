"use strict"

import {expect} from "chai"
import Pokemon from "../api/model/Pokemon.mjs";

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

    const idErrorMessage = "Id must be an integer greater or equal to 1"
    it('should fail to create a Pokemon whose id is not an integer', () => {
        expectErrorOnPkmCreate('id', NaN, idErrorMessage)
    })

    it('should fail to create a Pokemon whose id is 0', () => {
        expectErrorOnPkmCreate('id', 0, idErrorMessage)
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

    it("should fail to create a Pokemon when 'poids' is invalid", () => {
        const poidsErrorMessage = "Weight must be a number between 0.1 and 999.9"
        expectErrorOnPkmCreate('poids', 0, poidsErrorMessage)
        expectErrorOnPkmCreate('poids', 1000, poidsErrorMessage)
    })

    it("should fail to create a Pokemon when 'taille' is invalid", () => {
        const tailleErrorMessage = "Height must be a number greater or equal to 0.1"
        expectErrorOnPkmCreate('taille', 0, tailleErrorMessage)
    })

    it('should fail to create a Pokemon when a stat is not between 1 and 255', () => {
        const statsKeys = ["hp", "attack", "defense", "special_attack", "special_defense", "speed"]
        const statsErrorMessage = "Stats values must be a integer between 1 and 255"
        for (const key of statsKeys) {
            expectErrorOnPkmCreate('stats', {...validPokemon.stats, [key]: 0}, statsErrorMessage)
            expectErrorOnPkmCreate('stats', {...validPokemon.stats, [key]: 256}, statsErrorMessage)
        }
        expectErrorOnPkmCreate('stats', null, statsErrorMessage)
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

    it('should be fine to create a valid Pokemon', () => {
        try {
            new Pokemon(validPokemon)
        } catch {
            expect.fail("Should have not thrown an error")
        }
    })
})