const User = require('../models/Users')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt-nodejs')

function generateAccessToken(user){
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    return token;
}

exports.registerUser = async(req, res) => {
    try{
        const { email, password, locality, name, age, role} = req.body
        const user = await User.findOne({email: req.body.email})
        if(user){
            return res.status(400).json({message: 'error', result: null})
        }
        const newUser = new User({
            email,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(8), null),
            name,
            age,
            locality,
            role
        })
        await newUser.save()
        res.json({message: "success", result: null})
    }
    catch(err){
        console.log(err)
        res.status(500).json({message: "error", result: null})
    }
}

exports.loginUser = async(req, res) => {
    try{
        const { email, password } = req.body
        const user = await User.findOne({email: email})
        if(user){
            if(bcrypt.compareSync(password, user.password)){
                const aToken = generateAccessToken({email: user.email, role: user.role, name: user.name, locality: user.locality})
                res.json({message: "success", result: {aToken}})
            }
            else{
                res.status(403).json({message: "error", result: null})
            }
        }
        else{
            res.status(403).json({message: "error", result: null})
        }
    }
    catch(err){
        console.log(err)
        res.status(500).json({message: "error", result: null})
    }
}

exports.usersCountFilter = async(req, res) => {
    try{
        const count = await User.countDocuments(req.body)
        res.json({message: "success", result: count})
    }
    catch(err){
        res.status(500).json({message: "failue", result:null})
    }
}