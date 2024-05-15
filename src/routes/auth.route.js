const express = require("express")
const connectUser = require("../controllers/auth/login.controller")
const createUser = require("../controllers/auth/register.controller")
const logout = require('../controllers/auth/logout.controller')

const router = express.Router()

router.post('/api/auth', createUser )
router.post('/api/login', connectUser )
router.get('/api/logout', logout )



module.exports = router