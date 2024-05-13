const express = require("express")
const connectUser = require("../controllers/auth/login")
const createUser = require("../controllers/auth/register")
const generateNewToken = require('../controllers/auth/token')
const verifyToken = require('../Middlewares/verifyToken')


const router = express.Router()

router.post('/auth', createUser )
router.post('/login', connectUser )
router.get('/token',verifyToken, generateNewToken )


module.exports = router