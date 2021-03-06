const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CodeSchema = new Schema({
    data: { type: String, required: true },
    code: {
        type: String,
        required: true,
        unique: true,
        default: function () {
            var code = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            for (var i = 0; i < 11; i++) {
                code += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return code
        }
    },
    error_correction_level: { type: String, required: true, default: "M" },
    image_width: { type: Number, required: true,  default: 500},
    light_color: { type: String, required: true, default: "#ffffff"},
    dark_color: { type: String, required: true, default: "#000000"},
    media_type: { type: String, required: true, nullable: false, default: "png"},
    user : {
        type: Schema.Types.ObjectId,
        ref: "User", required: true
    },
})

const Code = mongoose.model('Code', CodeSchema)

module.exports = Code