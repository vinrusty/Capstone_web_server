const mongoose = require('mongoose')

const Emmision = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    product: {
        type: String,
        required: true
    },
    usage: {
        type: Number,
        required: true
    },
    prediction: {
        type: Number,
        required: true
    },
    morning: {
        type: Number,
        required: true
    },
    afternoon: {
        type: Number,
        required: true
    },
    evening: {
        type: Number,
        required: true
    },
    night: {
        type: Number,
        required: true
    },
    recommendation: {
        type: Object,
        required: true
    },
    fuelType: {
        type: String,
        required: true
    },
    date: {
        type: String
    }
},{
    timestamps: true
})

module.exports = mongoose.model("Emmisions", Emmision, "emmision");