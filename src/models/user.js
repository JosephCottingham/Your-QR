const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, select: false },
    codes : [{ type: Schema.Types.ObjectId, ref: "Code" }],
    access_tokens : [{ type: Schema.Types.ObjectId, ref: "Access_Token" }]
  })

UserSchema.pre('findOne', function (next) {
    this.populate('codes')
    this.populate('access_tokens')
    next()
})

UserSchema.pre('find', function (next) {
    this.populate('codes')
    this.populate('access_tokens')
    next()
})
  
const User = mongoose.model('User', UserSchema)

module.exports = User