const express = require("express")
const connectUser = require("../controllers/auth/login")
const createUser = require("../controllers/auth/register")


const router = express.Router()

router.post('/auth', createUser )
router.post('/login', connectUser )


module.exports = router