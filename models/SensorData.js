const mongoose = require('mongoose')

const Sensor = new mongoose.Schema({
    id: {
        type: String,
    },
    type: {
        type: String
    },
    usage: {
        type: Number
    },
    user: {
        type: String
    },
    sensor: {
        type: String
    },
    emission: {
        type: Number
    }
})

module.exports = mongoose.model("SensorData", Sensor, "sensorData");