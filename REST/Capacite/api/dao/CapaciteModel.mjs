import mongoose from "mongoose"
import Capacite from "../model/Capacite.mjs";

const capaciteSchema = new mongoose.Schema({
    id: {type: Number, required: true, unique: true},
    nom: {type: String, required: true},
    nomAnglais: {type: String, required: true, unique: true},
    nomNormalise: {type: String, required: true},
    description: String,
    pp: {type: Number, min: 1},
    precision: {type: Number, min: 1, max: 100},
    puissance: {type: Number, min: 1},
    type: {
        type: String,
        enum: Capacite.validTypes,
        required: true
    },
    pokemons: [String],
    categorie: {
        type: String,
        required: true,
        enum: Capacite.moveCategories
    }
}, {versionKey: false})

capaciteSchema.index({id: 1}, {unique: true})
capaciteSchema.index({nomNormalise: 1})
capaciteSchema.index({type: 1})
capaciteSchema.index({categorie: 1})

const CapaciteModel = mongoose.model('Capacite', capaciteSchema)

export {capaciteSchema}
export default CapaciteModel