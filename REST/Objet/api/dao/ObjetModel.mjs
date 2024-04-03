import mongoose from 'mongoose'
import Objet from "../model/Objet.mjs"

const objetSchema = new mongoose.Schema({
    nom: {type: String, required: true},
    nomAnglais: {type: String, required: true},
    nomNormalise: {type: String, required: true},
    description: String,
    sprite: String,
    categorie: {
        id: {type: Number, enum: Array.from(Objet.validCategories.keys())},
        nom: {type: String, enum: Array.from(Objet.validCategories.values())}
    }
}, {versionKey: false})

objetSchema.index({nomNormalise: 1})
objetSchema.index({'categorie.id': 1})

const ObjetModel = mongoose.model('Objet', objetSchema)

export default ObjetModel