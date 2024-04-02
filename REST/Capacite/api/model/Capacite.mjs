import mongoose from "mongoose"

const capaciteSchema = new mongoose.Schema({
    categorie: {
        type: String,
        required: true,
        enum: ['Spéciale', 'Physique', 'Statut']
    },
    description: String,
    id: {type: Number, required: true, unique: true},
    nom: {type: String, required: true},
    nomAnglais: {type: String, required: true, unique: true},
    nomNormalise: {type: String, required: true},
    pokemons: [String],
    pp: {type: Number, min: 1},
    precision: Number,
    puissance: Number,
    type: String
}, {versionKey: false})

capaciteSchema.index({id: 1}, {unique: true})
capaciteSchema.index({nomNormalise: 1})
capaciteSchema.index({type: 1})
capaciteSchema.index({categorie: 1})

const Capacite = mongoose.model('Capacite', capaciteSchema)

export {capaciteSchema}
export default Capacite