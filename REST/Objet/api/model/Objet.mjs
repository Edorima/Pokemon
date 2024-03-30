import mongoose from 'mongoose'

const objetSchema = new mongoose.Schema({
    categorie: {
        id: Number,
        nom: String
    },
    description: String,
    nom: {type: String},
    nomAnglais: {type: String},
    nomNormalise: {type: String},
    sprite: String
})

objetSchema.index({nomNormalise: 1})
objetSchema.index({'categorie.id': 1})

const Objet = mongoose.model('Objet', objetSchema)

export default Objet