import mongoose from 'mongoose'

const capaciteSchema = new mongoose.Schema({
    id: Number,
    nom: String,
    nomNormalise: String,
    type: String,
    pp: Number
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
        cache: {type: String, default: null}
    },
    types: [String],
    chromatique: Boolean,
    objet: objetSchema,
    capacites: {
        capacite1: {type: capaciteSchema, default: null},
        capacite2: {type: capaciteSchema, default: null},
        capacite3: {type: capaciteSchema, default: null},
        capacite4: {type: capaciteSchema, default: null}
    }
}, { _id: false })

const equipeSchema = new mongoose.Schema({
    nom: String,
    pokemons: {
        pokemon1: {type: pokemonSchema, required: true},
        pokemon2: {type: pokemonSchema, default: null},
        pokemon3: {type: pokemonSchema, default: null},
        pokemon4: {type: pokemonSchema, default: null},
        pokemon5: {type: pokemonSchema, default: null},
        pokemon6: {type: pokemonSchema, default: null}
    }
}, {_id: false})

const utilisateurSchema = new mongoose.Schema({
    equipePrefere: {type: String, default: null},
    equipes: [equipeSchema],
    motDePasse: {type: String, required: true},
    pseudo: {type: String, required: true, unique: true}
}, {versionKey: false})

utilisateurSchema.index({id: 1}, {unique: true})

const Utilisateur = mongoose.model('Utilisateur', utilisateurSchema)

export default Utilisateur