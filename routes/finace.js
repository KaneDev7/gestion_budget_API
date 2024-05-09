const express = require("express")
const { getFinances } = require("../controllers/finace")


const router = express.Router()

router.get('/finances',getFinances )

module.exports = router