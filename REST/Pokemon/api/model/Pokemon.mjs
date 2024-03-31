import mongoose from "mongoose"

const pokemonSchema = new mongoose.Schema({
    id: {type: Number, required: true, unique: true},
    nom: {type: String, required: true, unique: true},
    nomAnglais: {type: String, required: true, unique: true},
    nomNormalise: {type: String, required: true, unique: true},
    poids: {type: Number, min: 0.1, max: 999.9},
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
    taille: {type: Number, min: 0.1},
    talents: {
        normaux: [String],
        cache: String,
    },
    types: [String],
    capacites: [Number],
    description: String,
    espece: String,
    generation: {type: Number, min: 1}
}, {versionKey: false})

pokemonSchema.index({id: 1}, {unique: true})
pokemonSchema.index({nomNormalise: 1}, {unique: true})
pokemonSchema.index({nomAnglais: 1}, {unique: true})
pokemonSchema.index({generation: 1})
pokemonSchema.index({types: 1})

const Pokemon = mongoose.model('Pokemon', pokemonSchema)

export {pokemonSchema}
export default Pokemon