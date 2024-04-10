"use strict"

import {expect} from "chai"
import Utilisateur from "../api/model/Utilisateur.mjs"
import Equipe from "../api/model/Equipe.mjs"
import PokemonsEquipe from "../api/model/PokemonsEquipe.mjs"
import PokemonEquipe from "../api/model/PokemonEquipe.mjs"
import ObjetPokemon from "../api/model/ObjetPokemon.mjs"
import CapacitesPokemon from "../api/model/CapacitesPokemon.mjs"
import CapacitePokemon from "../api/model/CapacitePokemon.mjs"

describe('Utilisateur Model', () => {
    const validUser = {
        equipePrefere: null,
        equipes: [{
            nom: "Mon équipe préférée",
            pokemons: {
                pokemon1: {
                    id: 25,
                    nom: "Pikachu",
                    nomNormalise: "pikachu",
                    sprites: {
                        default: "default",
                        shiny: "shiny"
                    },
                    talents: {
                        normaux: ["Statik"],
                        cache: "Paratonnerre"
                    },
                    types: ["Électrik"],
                    chromatique: false,
                    objet: {
                        nom: "Baie Lonme",
                        nomNormalise: "baie lonme",
                        sprite: "sprite"
                    },
                    capacites: {
                        capacite1: {
                            id: 85,
                            nom: "Tonnerre",
                            nomNormalise: "tonnerre",
                            type: "Électrik",
                            pp: 15
                        },
                        capacite2: {
                            id: 25,
                            nom: "Ultimawashi",
                            nomNormalise: "ultimawashi",
                            type: "Normal",
                            pp: 5
                        },
                        capacite3: {
                            id: 70,
                            nom: "Force",
                            nomNormalise: "force",
                            type: "Normal",
                            pp: 15
                        },
                        capacite4: null
                    }
                },
                pokemon2: null,
                pokemon3: null,
                pokemon4: null,
                pokemon5: null,
                pokemon6: null
            }
        }],
        motDePasse: "motDePasse",
        pseudo: "OutGame"
    }

    describe('• Utilisateur', () => {
        const expectErrorOnUserCreate = (attr, value, expectedMessage) => {
            try {
                new Utilisateur({...validUser, [attr]: value})
                expect.fail("Should have thrown an error")
            } catch (e) {
                expect(e.message).to.equal(expectedMessage)
            }
        }

        it('should fail to create a User with errored username', () => {
            const pseudoErrorMessage = "'pseudo' must be a string of atleast length 3"
            expectErrorOnUserCreate('pseudo', null, pseudoErrorMessage)
            expectErrorOnUserCreate('pseudo', {}, pseudoErrorMessage)
            expectErrorOnUserCreate('pseudo', 'AB', pseudoErrorMessage)
        })

        it('should fail to create a User with errored password', () => {
            const mdpErrorMessage = "'motDePasse' must be a string of atleast length 7"
            expectErrorOnUserCreate('motDePasse', null, mdpErrorMessage)
            expectErrorOnUserCreate('motDePasse', {}, mdpErrorMessage)
            expectErrorOnUserCreate('motDePasse', 'test12', mdpErrorMessage)
        })

        it('should fail to create a User with invalid team', () => {
            const equipesErrorMessage = "'equipes' must be an array of objects or be undefined"
            expectErrorOnUserCreate('equipes', null, equipesErrorMessage)
            expectErrorOnUserCreate('equipes', [{}, 1], equipesErrorMessage)
        })

        it("should fail to create a User when 'equipePrefere' is not a string or null", () => {
            expectErrorOnUserCreate('equipePrefere', {}, "'equipePrefere' must be a string or null")
        })

        it('should be fine to create a valid User', () => {
            try {
                new Utilisateur(validUser)
                new Utilisateur({...validUser, equipes: undefined})
                new Utilisateur({...validUser, equipePrefere: undefined})
            } catch(e) {
                expect.fail(`Should have not thrown an error. Error: ${e.message}`)
            }
        })
    })

    describe('• Equipe', () => {
        const expectErrorOnTeamCreate = (attr, value, expectedMessage) => {
            try {
                new Equipe({...validUser.equipes[0], [attr]: value})
                expect.fail("Should have thrown an error")
            } catch (e) {
                expect(e.message).to.equal(expectedMessage)
            }
        }

        it('should fail to create a Team when nom is not a string', () => {
            const nomErrorMessage = "'nom' must be a string"
            expectErrorOnTeamCreate('nom', null, nomErrorMessage)
            expectErrorOnTeamCreate('nom', {}, nomErrorMessage)
        })

        it("should fail to create a Team when 'pokemons' is not an object", () => {
            const pokemonsErrorMessage = "'pokemons' must be an object"
            expectErrorOnTeamCreate('pokemons', null, pokemonsErrorMessage)
            expectErrorOnTeamCreate('pokemons', 1, pokemonsErrorMessage)
        })

        it('should be fine to create a valid Team', () => {
            try {
                new Equipe(validUser.equipes[0])
            } catch(e) {
                expect.fail(`Should have not thrown an error. Error: ${e.message}`)
            }
        })
    })

    describe('• PokemonsEquipe', () => {
        const validPokemons = validUser.equipes[0].pokemons

        it('should fail to create a Team of Pokemons when all 6 pokemons are null', () => {
            try {
                new PokemonsEquipe({
                    pokemon1: null, pokemon2: null, pokemon3: null,
                    pokemon4: null, pokemon5: null, pokemon6: null
                })
                expect.fail('Should have thrown an error')
            } catch (e) {
                expect(e.message).to.equal("must have atleast 1 non null pokemon")
            }
        })

        it('should fail to create a Team of Pokemons when a pokemon is invalid', () => {
            try {
                new PokemonsEquipe({...validPokemons, pokemon1: 1})
                expect.fail("Should have thrown an error")
            } catch (e) {
                expect(e.message).to.equal("'pokemon1' must be an object")
            }
        })

        it('should be fine to create a Team of Pokemons', () => {
            try {
                new PokemonsEquipe(validPokemons)
            } catch(e) {
                expect.fail(`Should have not thrown an error. Error: ${e.message}`)
            }
        })
    })

    describe('• PokemonEquipe', () => {
        const expectErrorOnTeamPkmCreate = (attr, value, expectedMessage) => {
            const pokemon = validUser.equipes[0].pokemons.pokemon1
            try {
                new PokemonEquipe({...pokemon, [attr]: value})
                expect.fail("Should have thrown an error")
            } catch (e) {
                expect(e.message).to.equal(expectedMessage)
            }
        }

        it('should fail to create a Team Pokemon whose id is invalid', () => {
            const idErrorMessage = "Id must be an integer greater or equal to 1"
            expectErrorOnTeamPkmCreate('id', 0, idErrorMessage)
            expectErrorOnTeamPkmCreate('id', NaN, idErrorMessage)
        })

        it("should fail to create a Team Pokemon when 'nom' is an empty string", () => {
            const nomErrorMessage = "'nom' must be a not empty string"
            expectErrorOnTeamPkmCreate('nom', '', nomErrorMessage)
        })

        it("should fail to create a Team Pokemon when 'nomNormalise' is an empty string", () => {
            const nnErrorMessage = "'nomNormalise' must be a not empty string"
            expectErrorOnTeamPkmCreate('nomNormalise', '', nnErrorMessage)
        })

        it("should fail to create a Team Pokemon when 'sprites' is invalid", () => {
            const spritesErrorMessage = "'sprites' must be an object"
            expectErrorOnTeamPkmCreate('sprites', null, spritesErrorMessage)
            expectErrorOnTeamPkmCreate('sprites', '', spritesErrorMessage)

            expectErrorOnTeamPkmCreate('sprites',
                {default: null},
                "'default' must be a string"
            )
            expectErrorOnTeamPkmCreate('sprites',
                {default: 'default', shiny: null},
                "'shiny' must be a string"
            )
        })

        it("should fail to create a Team Pokemon when 'talents' is invalid", () => {
            const talentsErrorMessage = "'talents' must be an object"
            expectErrorOnTeamPkmCreate('talents', null, talentsErrorMessage)
            expectErrorOnTeamPkmCreate('talents', '', talentsErrorMessage)

            expectErrorOnTeamPkmCreate(
                'talents',
                {normaux: ['talent', 1]},
                "'normaux' must be an array of strings"
            )

            expectErrorOnTeamPkmCreate(
                'talents',
                {normaux: [], cache: 1},
                "'cache' must be a string or null"
            )
        })

        it('should fail to create a Team Pokemon with an invalid types array', () => {
            const typesErrorMessage = "Types must be an array of atleast one valid type and not more than 2"
            expectErrorOnTeamPkmCreate('types', null, typesErrorMessage)
            expectErrorOnTeamPkmCreate('types', [], typesErrorMessage)
            expectErrorOnTeamPkmCreate('types', ['t1', 't2', 't3'], typesErrorMessage)
            expectErrorOnTeamPkmCreate('types', ['Ombre'], typesErrorMessage)
        })

        it("should fail to create a Team Pokemon when 'chromatique' is not a boolean", () => {
            const chromaErrorMessage = "'chromatique' must be a boolean"
            expectErrorOnTeamPkmCreate('chromatique', null, chromaErrorMessage)
            expectErrorOnTeamPkmCreate('chromatique', 1, chromaErrorMessage)
        })

        it("should fail to create a Team Pokemon when 'objet' is invalid", () => {
            const objetErrorMessage = "'objet' must be an object or null"
            expectErrorOnTeamPkmCreate('objet', '', objetErrorMessage)
            expectErrorOnTeamPkmCreate('objet', 1, objetErrorMessage)
        })

        it("should fail to create a Team Pokemon with an invalid moves array", () => {
            const capacitesErrorMessage = "'capacites' must be an object"
            expectErrorOnTeamPkmCreate('capacites', null, capacitesErrorMessage)
            expectErrorOnTeamPkmCreate('capacites', 1, capacitesErrorMessage)
        })

        it('should be fine to create a Team Pokemon', () => {
            try {
                new PokemonEquipe(validUser.equipes[0].pokemons.pokemon1)
            } catch(e) {
                expect.fail(`Should have not thrown an error. Error: ${e.message}`)
            }
        })

        it('should be fine to create a Team Pokemon with no item', () => {
            try {
                new PokemonEquipe({...validUser.equipes[0].pokemons.pokemon1, objet: null})
            } catch(e) {
                expect.fail(`Should have not thrown an error. Error: ${e.message}`)
            }
        })
    })

    describe('• ObjetPokemon', () => {
        const validItem = validUser.equipes[0].pokemons.pokemon1.objet
        const expectErrorOnPkmItemCreate = (attr, value, expectedMessage) => {
            try {
                new ObjetPokemon({...validItem, [attr]: value})
                expect.fail("Should have thrown an error")
            } catch (e) {
                expect(e.message).to.equal(expectedMessage)
            }
        }

        it("should fail to create a Pokemon Item when 'nom' is an empty string", () => {
            const nomErrorMessage = "'nom' must be a not empty string"
            expectErrorOnPkmItemCreate('nom', '', nomErrorMessage)
        })

        it("should fail to create a Pokemon Item when 'nomNormalise' is an empty string", () => {
            const nnErrorMessage = "'nomNormalise' must be a not empty string"
            expectErrorOnPkmItemCreate('nomNormalise', '', nnErrorMessage)
        })

        it("should fail to create a Pokemon Item when 'sprite' is not a string nor null", () => {
            const spriteErrorMessage = "'sprite' must be a string or null"
            expectErrorOnPkmItemCreate('sprite', {}, spriteErrorMessage)
        })

        it('should be fine to create a valid Pokemon Item', () => {
            try {
                new ObjetPokemon(validItem)
            } catch(e) {
                expect.fail(`Should have not thrown an error. Error: ${e.message}`)
            }
        })
    })

    describe('• CapacitesPokemon', () => {
        const validCapacitesPokemon = validUser.equipes[0].pokemons.pokemon1.capacites

        it('should fail to create Pokemon Moves when all 4 Moves are null', () => {
            try {
                new CapacitesPokemon({
                    capacite1: null, capacite2: null,
                    capacite3: null, capacite4: null
                })
                expect.fail('Should have thrown an error')
            } catch (e) {
                expect(e.message).to.equal("must have atleast 1 non null move")
            }
        })

        it('should fail to create Pokemon Moves when a move is invalid', () => {
            try {
                new CapacitesPokemon({...validCapacitesPokemon, capacite1: 1})
                expect.fail("Should have thrown an error")
            } catch (e) {
                expect(e.message).to.equal("'capacite1' must be an object")
            }
        })

        it('should be fine to create valid Pokemon Moves', () => {
            try {
                new CapacitesPokemon(validCapacitesPokemon)
            } catch(e) {
                expect.fail(`Should have not thrown an error. Error: ${e.message}`)
            }
        })
    })

    describe('• CapacitePokemon', () => {
        const validCapacitePokemon = validUser.equipes[0].pokemons.pokemon1.capacites.capacite1
        const expectErrorOnPkmMoveCreate = (attr, value, expectedMessage) => {
            try {
                new CapacitePokemon({...validCapacitePokemon, [attr]: value})
                expect.fail("Should have thrown an error")
            } catch (e) {
                expect(e.message).to.equal(expectedMessage)
            }
        }

        it('should fail to create a Pokemon Move whose id is invalid', () => {
            const idErrorMessage = "Id must be an integer greater or equal to 1"
            expectErrorOnPkmMoveCreate('id', 0, idErrorMessage)
            expectErrorOnPkmMoveCreate('id', NaN, idErrorMessage)
        })

        it("should fail to create a Pokemon Move when 'nom' is an empty string", () => {
            const nomErrorMessage = "'nom' must be a not empty string"
            expectErrorOnPkmMoveCreate('nom', '', nomErrorMessage)
        })

        it("should fail to create a Pokemon Move when 'nomNormalise' is an empty string", () => {
            const nnErrorMessage = "'nomNormalise' must be a not empty string"
            expectErrorOnPkmMoveCreate('nomNormalise', '', nnErrorMessage)
        })

        it('should fail to create a Pokemon Move with an invalid type', () => {
            const typeErrorMessage = "Type must be a valid one"
            expectErrorOnPkmMoveCreate('type', 'Ombre', typeErrorMessage)
        })

        it('should fail to create a Move with invalid PP', () => {
            const ppErrorMessage = "PP must be an integer greater or equal to 1"
            expectErrorOnPkmMoveCreate('pp', 0, ppErrorMessage)
        })

        it('should be fine to create a valid Pokemon Move', () => {
            try {
                new CapacitePokemon(validCapacitePokemon)
            } catch(e) {
                expect.fail(`Should have not thrown an error. Error: ${e.message}`)
            }
        })
    })
})