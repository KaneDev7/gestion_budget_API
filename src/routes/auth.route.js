const express = require("express")
const connectUser = require("../controllers/auth/login.controller")
const createUser = require("../controllers/auth/register.controller")
const logout = require('../controllers/auth/logout.controller')
const { validateUserDataRegister, checkUsernameInDb, validateUserDataLogin, checkPassword } = require("../Middlewares/validateUser")

const router = express.Router()

router.post('/api/auth', validateUserDataRegister, checkUsernameInDb, createUser )
router.post('/api/login',validateUserDataLogin, checkPassword, connectUser )
router.get('/api/logout', logout)

module.exports = router