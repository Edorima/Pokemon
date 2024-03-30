import mongoose from "mongoose"

const pokemonSchema = new mongoose.Schema({
    id: {type: Number, unique: true},
    nom: {type: String, unique: true},
    nomAnglais: {type: String, unique: true},
    nomNormalise: {type: String, unique: true},
    poids: Number,
    sprites: {
        default: String,
        shiny: String,
    },
    stats: {
        hp: Number,
        attack: Number,
        defense: Number,
        special_attack: Number,
        special_defense: Number,
        speed: Number,
    },
    taille: Number,
    talents: {
        normaux: [String],
        cache: String,
    },
    types: [String],
    capacites: [Number],
    description: String,
    espece: String,
    generation: Number
})

pokemonSchema.index({id: 1}, {unique: true})
pokemonSchema.index({nomNormalise: 1}, {unique: true})
pokemonSchema.index({nomAnglais: 1}, {unique: true})
pokemonSchema.index({generation: 1})
pokemonSchema.index({types: 1})

const Pokemon = mongoose.model('Pokemon', pokemonSchema)

export default Pokemon