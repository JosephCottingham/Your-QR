const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AccessTokenSchema = new Schema({
    token: { type: String, required: true, unique: true},
    label: { type: String, required: true, default: "New Token"},
    user : {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
})


module.exports = mongoose.model('AccessToken', AccessTokenSchema)
