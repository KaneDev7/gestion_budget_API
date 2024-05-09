const express = require("express")
const verifyToken = require('../Middlewares/verifyToken')
const {getBudget, createBudget } = require("../controllers/budget")


const router = express.Router()

router.get('/budget', getBudget)
router.post('/budget',createBudget)

module.exports = router