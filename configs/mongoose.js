const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URL);

const db = mongoose.connection;

db.once('open', () => {
    console.log("Connection DB Successful");
});

db.on('error', console.error.bind(console, "Error in DB Connection"));

module.exports = db;