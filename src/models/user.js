const mongoose = require('mongoose')
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema
const Populate = require("../util/autopopulate");


const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, select: false },
    codes : [
        {
            type: Schema.Types.ObjectId,
            ref: "Code"
        }
    ],
    accessTokens : [
        {
            type: Schema.Types.ObjectId,
            ref: "AccessToken"
        }
    ]
  },
    { timestamps: { createdAt: 'created_at' } }
);

// UserSchema
//     .pre('findOne', Populate('accessTokens'))
//     .pre('find', Populate('accessTokens'))

// Must use function here! ES6 => functions do not bind this!
UserSchema.pre("save", function (next) {
    // ENCRYPT PASSWORD
    const user = this;
    if (!user.isModified("password")) {
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
            user.password = hash;
            next();
        });
    });
});

// Need to use function to enable this.password to work.
UserSchema.methods.comparePassword = function (password, done) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        done(err, isMatch);
    });
};
module.exports = mongoose.model('User', UserSchema)
