
const express = require("express")

const {generateNewToken, getToken} = require('../controllers/auth/token')


const router = express.Router()

router.get('/token',  getToken )
router.get('/token/new', generateNewToken )


module.exports = router
