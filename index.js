const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const mongoose = require('./configs/mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('passport')
const session = require('express-session')
const cookieParser = require('cookie-parser')

app.use(cors(
    {
        origin: "http://localhost:3000",
        methods: "GET,POST,PUT,DELETE",
    }
));

app.use(session({
    secret: "secret",
    resave: false ,
    saveUninitialized: true ,
}))
// This is the basic express session({..}) initialization.
app.use(passport.initialize()) 
// init passport on every route call.
app.use(passport.session())    
// allow passport to use "express-session".
app.use(cookieParser());

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use("/", require("./routers"))

if(process.env.NODE_ENV !== 'test'){
    app.listen(3001, () => {
        console.log("listening at 3001")
    })
}

module.exports = app