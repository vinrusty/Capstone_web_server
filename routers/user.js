const router = require('express').Router()
const userController = require('../controllers/User')

router.post("/register", userController.registerUser)
router.post("/login", userController.loginUser)
router.get("/count", userController.usersCountFilter)

module.exports = router