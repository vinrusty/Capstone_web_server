const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')

const User = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    locality: {
        type: String,
        required: true
    },
    role: {
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model("User", User, "users")

