import mongoose from "mongoose"
import Pokemon from "../model/Pokemon.mjs"

const pokemonSchema = new mongoose.Schema({
    id: {type: Number, required: true, unique: true, min: 1},
    nom: {type: String, required: true, unique: true, minLength: 1},
    nomAnglais: {type: String, required: true, unique: true, minLength: 1},
    nomNormalise: {type: String, required: true, unique: true, minLength: 1},
    poids: {type: Number, min: 0.1, max: 999.9, required: true},
    sprites: {
        default: String,
        shiny: String
    },
    stats: {
        hp: {type: Number, min: 1, max: 255},
        attack: {type: Number, min: 1, max: 255},
        defense: {type: Number, min: 1, max: 255},
        special_attack: {type: Number, min: 1, max: 255},
        special_defense: {type: Number, min: 1, max: 255},
        speed: {type: Number, min: 1, max: 255}
    },
    taille: {type: Number, min: 0.1},
    talents: {
        normaux: [String],
        cache: String
    },
    types: {
        type: [String],
        minLength: 1,
        maxLength: 2,
        enum: Pokemon.validTypes,
        required: true
    },
    capacites: [Number],
    description: {type: String, required: true},
    espece: {type: String, required: true},
    generation: {type: Number, min: 1, required: true}
}, {versionKey: false})

pokemonSchema.index({id: 1}, {unique: true})
pokemonSchema.index({nomNormalise: 1}, {unique: true})
pokemonSchema.index({nomAnglais: 1}, {unique: true})
pokemonSchema.index({generation: 1})
pokemonSchema.index({types: 1})

const PokemonModel = mongoose.model('Pokemon', pokemonSchema)

export default PokemonModel