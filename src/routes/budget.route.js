const express = require("express")
const {createBudget } = require("../controllers/budget.controller")


const router = express.Router()

router.post('/api/budget',createBudget)

module.exports = router