const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CodeSchema = new Schema({
    data: { type: String, required: true },
    Error_Correction_Level: { type: String, required: true, default: "M" },
    image_width: { type: Number, required: true,  default: 500},
    light_color: { type: String, required: true, default: "#ffffff"},
    dark_color: { type: String, required: true, default: "#000000"},
    media_type: { type: String, required: true, default: "png"},
    user : { type: Schema.Types.ObjectId, ref: "User", required: true },
})

const Code = mongoose.model('Code', CodeSchema)

module.exports = Code