const express = require('express')
const router = express.Router();

router.use("/record", require("./emmision"))
router.use("/auth", require("./user"))

module.exports = router