const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AccessTokenSchema = new Schema({
    token: { type: String, required: true, unique: true, default: Math.random().toString(36).substring(30)},
    label: { type: String, required: true, default: "New Token"},
    user : { type: Schema.Types.ObjectId, ref: "User", required: true },
})

const AccessToken = mongoose.model('Code', AccessTokenSchema)

module.exports = AccessToken