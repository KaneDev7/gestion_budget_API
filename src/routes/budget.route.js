const express = require("express")
const {getBudget, createBudget } = require("../controllers/budget.controller")


const router = express.Router()

router.get('/api/budget', getBudget)
router.post('/api/budget',createBudget)

module.exports = router