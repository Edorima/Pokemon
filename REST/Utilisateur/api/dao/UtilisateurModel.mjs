import mongoose from 'mongoose'
import CapacitePokemon from "../model/CapacitePokemon.mjs"
import PokemonEquipe from "../model/PokemonEquipe.mjs"

const capaciteSchema = new mongoose.Schema({
    id: {type: Number, min: 1},
    nom: String,
    nomNormalise: String,
    type: {type: String, enum: CapacitePokemon.validTypes},
    pp: {type: Number, min: 1}
}, { _id: false })

const objetSchema = new mongoose.Schema({
    nom: String,
    nomNormalise: String,
    sprite: String
}, { _id: false })

const pokemonSchema = new mongoose.Schema({
    id: Number,
    nom: String,
    nomNormalise: String,
    sprites: {
        default: String,
        shiny: String
    },
    talents: {
        normaux: [String],
        cache: {type: String}
    },
    types: {type: [String], enum: PokemonEquipe.validTypes},
    chromatique: Boolean,
    objet: objetSchema,
    capacites: {
        capacite1: capaciteSchema,
        capacite2: capaciteSchema,
        capacite3: capaciteSchema,
        capacite4: capaciteSchema
    }
}, { _id: false })

const equipeSchema = new mongoose.Schema({
    nom: String,
    pokemons: {
        pokemon1: {type: pokemonSchema, required: true},
        pokemon2: pokemonSchema,
        pokemon3: pokemonSchema,
        pokemon4: pokemonSchema,
        pokemon5: pokemonSchema,
        pokemon6: pokemonSchema
    }
}, {_id: false})

const utilisateurSchema = new mongoose.Schema({
    equipePrefere: {type: String, default: null},
    equipes: [equipeSchema],
    motDePasse: {type: String, required: true},
    pseudo: {type: String, required: true, unique: true}
}, {versionKey: false})

utilisateurSchema.index({pseudo: 1}, {unique: true})

const UtilisateurModel = mongoose.model('Utilisateur', utilisateurSchema)

export default UtilisateurModel