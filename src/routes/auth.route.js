const express = require("express")
const connectUser = require("../controllers/auth/login.controller")
const createUser = require("../controllers/auth/register.controller")


const router = express.Router()

router.post('/api/auth', createUser )
router.post('/api/login', connectUser )


module.exports = router