const express = require("express")
const {getBudget, updateBudget, createBudget } = require("../controllers/budget")


const router = express.Router()

router.get('/budget', getBudget)
router.post('/budget', createBudget)
router.put('/budget', updateBudget)


module.exports = router