const express = require("express")
const { getFinances } = require("../controllers/finance.controller")


const router = express.Router()
router.get('/api/finances',getFinances )

module.exports = router