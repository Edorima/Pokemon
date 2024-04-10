"use strict"

import {expect} from "chai"
import supertest from 'supertest'
import server from '../server.mjs'

const requestWithSupertest = supertest(server)

//Utilise l'environnement de TEST du serveur
describe('Utilisateur Routes', () => {
    describe('• POST /register', () => {
        it('should be able to create an account', async () => {
            const response = await requestWithSupertest.post('/register')
                .set('Content-type', 'application/json')
                .send({pseudo: 'OutGame', motDePasse: 'test123'})

            expect(response.status).to.equal(201)
            expect(response.body.success).to.be.true
            expect(response.body.token).to.be.a('string')
        })

        it('should fail to create an account, bad data', async () => {
            const response = await requestWithSupertest.post('/register')
                .set('Content-type', 'application/json')
                .send({pseudo: 'OutGame'})

            expect(response.status).to.equal(400)
            expect(response.body.success).to.be.false
            expect(response.body.message).to.equal("Utilisateur invalide")
        })
    })

    describe('• POST /login', () => {
        it('should be able to login', async () => {
            const response = await requestWithSupertest.post('/login')
                .set('Content-type', 'application/json')
                .send({pseudo: 'OutGame', motDePasse: 'test123'})

            expect(response.status).to.equal(200)
            expect(response.body.success).to.be.true
            expect(response.body.token).to.be.a('string')
        })

        it('should be not able to login with incorrect password', async () => {
            const response = await requestWithSupertest.post('/login')
                .set('Content-type', 'application/json')
                .send({pseudo: 'OutGame', motDePasse: 'incorrect'})

            expect(response.status).to.equal(401)
            expect(response.body).to.deep.equal({
                success: false, message: "Mot de passe incorrect"
            })
        })

        it('should not be able to login to unknown account', async () => {
            const response = await requestWithSupertest.post('/login')
                .set('Content-type', 'application/json')
                .send({pseudo: 'Unknown', motDePasse: 'password'})

            expect(response.status).to.equal(404)
            expect(response.body.success).to.be.false
            expect(response.body).to.deep.equal({
                success: false, message: "L'utilisateur n'existe pas"
            })
        })
    })

    describe('• GET /profil', () => {
        it('should get the profil', async () => {
            const loginResponse = await requestWithSupertest.post('/login')
                .set('Content-type', 'application/json')
                .send({pseudo: 'OutGame', motDePasse: 'test123'})

            const response = await requestWithSupertest.get('/profil')
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${loginResponse.body.token}`)
                .send()

            expect(response.status).to.equal(200)
            expect(response.body).to.deep.equal({
                pseudo: 'OutGame', equipes: [], equipePrefere: null
            })
        })

        it('should not get the profil if token is missing', async () => {
            const response = await requestWithSupertest.get('/profil')
                .set('Content-type', 'application/json')
                .send()

            expect(response.status).to.equal(401)
            expect(response.body).to.deep.equal({
                success: false, message: 'Token manquant'
            })
        })

        it('should not get the profil if token is invalid', async () => {
            const response = await requestWithSupertest.get('/profil')
                .set('Content-type', 'application/json')
                .set('Authorization', 'Bearer tokenInvalide')
                .send()

            expect(response.status).to.equal(401)
            expect(response.body).to.deep.equal({
                success: false, message: 'Token invalide'
            })
        })
    })

    describe('Authorization Routes', () => {
        const validTeam = {
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
        }

        let token

        beforeEach(async () => {
            const loginResponse = await requestWithSupertest.post('/login')
                .set('Content-type', 'application/json')
                .send({pseudo: 'OutGame', motDePasse: 'test123'})

            token = loginResponse.body.token
        })

        describe('• POST /profil', () => {
            it('should create a team', async () => {
                const response = await requestWithSupertest.post('/profil')
                    .set('Content-type', 'application/json')
                    .set('Authorization', `Bearer ${token}`)
                    .send(validTeam)

                expect(response.status).to.equal(201)
                expect(response.body).to.deep.equal({
                    success: true, message: 'Équipe créée'
                })
            })

            it('should not create a team when already existing', async () => {
                const response = await requestWithSupertest.post('/profil')
                    .set('Content-type', 'application/json')
                    .set('Authorization', `Bearer ${token}`)
                    .send(validTeam)

                expect(response.status).to.equal(409)
                expect(response.body).to.deep.equal({
                    success: false, message: "L'équipe existe déjà"
                })
            })

            it('should not create a team when invalid', async () => {
                const response = await requestWithSupertest.post('/profil')
                    .set('Content-type', 'application/json')
                    .set('Authorization', `Bearer ${token}`)
                    .send({...validTeam, nom: null})

                expect(response.status).to.equal(400)
                expect(response.body).to.deep.equal({
                    success: false, message: 'Équipe invalide'
                })
            })
        })

        describe('• PUT /profil', () => {
            it('should be able to modify a team', async () => {
                validTeam.pokemons.pokemon1.chromatique = true
                validTeam.pokemons.pokemon1.capacites.capacite2 = {
                    id: 17,
                    nom: "Cru-Ailes",
                    nomNormalise: "cru-ailes",
                    type: "Vol",
                    pp: 35
                }

                const response = await requestWithSupertest.put('/profil')
                    .set('Content-type', 'application/json')
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                        nomActuel: validTeam.nom,
                        pokemons: validTeam.pokemons,
                        nouveauNom: validTeam.nom
                    })

                expect(response.status).to.equal(204)
                expect(response.body).to.be.empty
            })

            it('should not fail to modify a team with no changes', async () => {
                const response = await requestWithSupertest.put('/profil')
                    .set('Content-type', 'application/json')
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                        nomActuel: validTeam.nom,
                        pokemons: validTeam.pokemons,
                        nouveauNom: validTeam.nom
                    })

                expect(response.status).to.equal(200)
                expect(response.body).to.deep.equal({
                    success: true, message: 'Aucune mise à jour effectuée'
                })
            })

            it("should fail to modify a team that doesn't exist", async () => {
                const response = await requestWithSupertest.put('/profil')
                    .set('Content-type', 'application/json')
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                        nomActuel: 'doesnotexist',
                        pokemons: validTeam.pokemons,
                        nouveauNom: 'doesnotexist'
                    })

                expect(response.status).to.equal(404)
                expect(response.body).to.deep.equal({
                    success: false, message: "L'équipe n'existe pas"
                })
            })

            it("should fail to modify a team with invalid pokemons", async () => {
                const invalidPkms = {
                    ...validTeam.pokemons,
                    pokemon1: {
                        ...validTeam.pokemons.pokemon1,
                        types: ['t1', 't2', 't3']
                    }
                }

                const response = await requestWithSupertest.put('/profil')
                    .set('Content-type', 'application/json')
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                        nomActuel: validTeam.nom,
                        pokemons: invalidPkms,
                        nouveauNom: validTeam.nom
                    })

                expect(response.status).to.equal(400)
                expect(response.body).to.deep.equal({
                    success: false, message: 'Pokemons invalide'
                })
            })
        })

        describe('• DELETE /profil', () => {
            it('should be able to delete a team', async () => {
                const response = await requestWithSupertest.delete('/profil')
                    .set('Content-type', 'application/json')
                    .set('Authorization', `Bearer ${token}`)
                    .send({nomEquipe: validTeam.nom})

                expect(response.status).to.equal(204)
                expect(response.body).to.be.empty
            })

            it("should fail to delete a team that doesn't exist", async () => {
                const response = await requestWithSupertest.delete('/profil')
                    .set('Content-type', 'application/json')
                    .set('Authorization', `Bearer ${token}`)
                    .send({nomEquipe: 'doesnotexist'})

                expect(response.status).to.equal(404)
                expect(response.body).to.deep.equal({
                    success: false, message: "L'équipe n'existe pas"
                })
            })
        })
    })
})