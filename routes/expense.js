const express = require("express")

const {
    getExpenses,
    createExpenses,
    updateExpenses
} = require("../controllers/expense")


const router = express.Router()

router.get('/expenses', getExpenses)
router.post('/expense', createExpenses)
router.put('/expenses', updateExpenses)
router.delete('/expenses',)

module.exports = router