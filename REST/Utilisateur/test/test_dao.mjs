"use strict"

import {expect} from "chai"
import mongoose from "mongoose"
import {MongoMemoryServer} from "mongodb-memory-server"
import utilisateurDAO from "../api/dao/utilisateurDAO.mjs"
import Utilisateur from "../api/model/Utilisateur.mjs"
import Equipe from "../api/model/Equipe.mjs"
import PokemonsEquipe from "../api/model/PokemonsEquipe.mjs"
import PokemonEquipe from "../api/model/PokemonEquipe.mjs"

describe('UtilisateurDAO', () => {
    before(async () => {
        await mongoose.connection.close()
        const mongoServer = await MongoMemoryServer.create()
        const uri = mongoServer.getUri()
        await mongoose.connect(uri)
    })

    beforeEach(async () => {
        await utilisateurDAO.removeAll()
    })

    it('getUser null', async () => {
        const user = await utilisateurDAO.getUser('pseudo')
        expect(user).to.be.null
    })

    it('getUser found', async () => {
        const newUser = new Utilisateur({pseudo: 'OutGame', motDePasse: "test123"})
        await utilisateurDAO.addUser(newUser)

        const user = await utilisateurDAO.getUser('OutGame')
        expect(user).to.be.not.null
        expect(user.pseudo).to.equal(newUser.pseudo)
    })

    it('addUser already exists', async () => {
        const user1 = new Utilisateur({
            pseudo: 'OutGame',
            motDePasse: "test123"
        })
        await utilisateurDAO.addUser(user1)

        const user2 = new Utilisateur({
            pseudo: 'OutGame',
            motDePasse: "otherpswd"
        })

        try {
            await utilisateurDAO.addUser(user2)
            expect.fail('Should have thrown an error')
        } catch (e) {
            expect(e).to.equal("L'utilisateur existe déjà")
        }
    })

    const validTeam = new Equipe({
        nom: "equipe",
        pokemons: {
            pokemon1: {
                id: 567,
                nom: "Aéroptéryx",
                nomNormalise: "aeropteryx",
                sprites: {default: "default", shiny: "shiny"},
                talents: {normaux: ["Défaitiste"], cache: null},
                objet: null,
                types: ["Roche", "Vol"],
                chromatique: false,
                capacites: {
                    capacite1: {
                        nom: "Météores", nomNormalise: "meteores",
                        type: "Normal", pp: 20, id: 129
                    },
                    capacite2: null,
                    capacite3: null,
                    capacite4: null
                }
            },
            pokemon2: null, pokemon3: null,
            pokemon4: null, pokemon5: null,
            pokemon6: null
        }
    })

    it("getTeam team don't exist", async () => {
        const newUser = new Utilisateur({
            pseudo: 'OutGame',
            motDePasse: "test123"
        })
        await utilisateurDAO.addUser(newUser)

        const equipe = await utilisateurDAO.getTeam(newUser.pseudo, 'equipe')
        expect(equipe).to.be.null
    })

    it("getTeam user don't exist", async () => {
        const equipe = await utilisateurDAO.getTeam(
            'OutGame', 'equipe'
        )
        expect(equipe).to.be.null
    })

    it('addTeam not added', async () => {
        const newUser = new Utilisateur({
            pseudo: 'OutGame',
            motDePasse: "test123",
            equipes: [validTeam]
        })
        await utilisateurDAO.addUser(newUser)
        try {
            await utilisateurDAO.addTeam(newUser.pseudo, validTeam)
            expect.fail("Should have thrown an error")
        } catch (e) {
            expect(e).to.equal("L'équipe existe déjà")
        }
    })

    it('addTeam added', async () => {
        const newUser = new Utilisateur({pseudo: 'OutGame', motDePasse: "test123"})
        await utilisateurDAO.addUser(newUser)
        await utilisateurDAO.addTeam(newUser.pseudo, validTeam)
        const team = await utilisateurDAO.getTeam(newUser.pseudo, validTeam.nom)
        expect(team).to.not.be.null
        expect(team).to.deep.equal(validTeam)
    })

    it("editTeam team don't exist", async () => {
        const newUser = new Utilisateur({
            pseudo: 'OutGame',
            motDePasse: "test123",
        })
        await utilisateurDAO.addUser(newUser)

        try {
            await utilisateurDAO.editTeam(newUser.pseudo, 'equipe', validTeam.pokemons)
            expect.fail('Should have thrown an error')
        } catch (e) {
            expect(e).to.equal("L'équipe n'existe pas")
        }
    })

    it('editTeam team modified', async () => {
        const newUser = new Utilisateur({
            pseudo: 'OutGame',
            motDePasse: "test123",
            equipes: [validTeam]
        })
        await utilisateurDAO.addUser(newUser)

        // Passage de l'attribut 'chromatique' à true
        const newPokemon = new PokemonEquipe({
            ...validTeam.pokemons.pokemon1, chromatique: true
        })

        try {
            const modified = await utilisateurDAO.editTeam(
                newUser.pseudo,
                'equipe',
                new PokemonsEquipe({...validTeam.pokemons, pokemon1: newPokemon})
            )
            expect(modified).to.be.true
        } catch (e) {
            expect.fail(`Should have not thrown an error. Error : ${e}`)
        }
    })

    it('editTeam team modified and name modified', async () => {
        const newUser = new Utilisateur({
            pseudo: 'OutGame',
            motDePasse: "test123",
            equipes: [validTeam]
        })
        await utilisateurDAO.addUser(newUser)

        // Passage de l'attribut 'chromatique' à true
        const newPokemon = new PokemonEquipe({
            ...validTeam.pokemons.pokemon1, chromatique: true
        })

        try {
            const modified = await utilisateurDAO.editTeam(
                newUser.pseudo,
                validTeam.nom,
                new PokemonsEquipe({...validTeam.pokemons, pokemon1: newPokemon}),
                'newEquipe'
            )
            expect(modified).to.be.true
            const newTeam = await utilisateurDAO.getTeam(newUser.pseudo, 'newEquipe')
            expect(newTeam).to.be.not.null
            expect(newTeam.pokemons.pokemon1.chromatique).to.be.true
        } catch (e) {
            expect.fail(`Should have not thrown an error. Error : ${e}`)
        }
    })

    it('deleteTeam delete success', async () => {
        const newUser = new Utilisateur({
            pseudo: 'OutGame',
            motDePasse: "test123",
            equipes: [validTeam]
        })
        await utilisateurDAO.addUser(newUser)
        await utilisateurDAO.deleteTeam(newUser.pseudo, validTeam.nom)
        const team = await utilisateurDAO.getTeam(newUser.pseudo, validTeam.nom)
        expect(team).to.be.null
    })
})