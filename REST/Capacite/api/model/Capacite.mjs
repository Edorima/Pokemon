import mongoose from "mongoose"

const capaciteSchema = new mongoose.Schema({
    categorie: String,
    description: String,
    id: {type: Number, unique: true},
    nom: String,
    nomAnglais: String,
    nomNormalise: String,
    pokemons: [String],
    pp: Number,
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