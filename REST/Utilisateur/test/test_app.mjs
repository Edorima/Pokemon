"use strict"

import {expect} from "chai"
import supertest from 'supertest'
import server from '../server.mjs'

const requestWithSupertest = supertest(server)

//Utilise l'environnement de TEST du serveur
describe('Utilisateur Routes', () => {
    describe('• POST /register', () => {
        // TODO
    })

    describe('• POST /login', () => {
        // TODO
    })

    describe('• GET /profil', () => {
        // TODO
    })

    describe('• POST /profil', () => {
        // TODO
    })

    describe('• PUT /profil', () => {
        // TODO
    })
    describe('• DELETE /profil', () => {
        // TODO
    })
})