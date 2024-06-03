const mongoose = require("mongoose")
const uniqValidator = require("mongoose-unique-validator")

const UserSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true,}
}, {
    timestamps: true
})

UserSchema.plugin(uniqValidator)

module.exports = mongoose.model("e_users", UserSchema)
