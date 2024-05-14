
const express = require("express")
const {generateNewToken, getToken} = require('../controllers/auth/token.controller')

const router = express.Router()

router.get('/api/token',  getToken )
router.get('/api/token/new', generateNewToken )


module.exports = router
