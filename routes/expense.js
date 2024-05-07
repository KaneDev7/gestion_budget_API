const express = require("express")

const {
    getExpenses,
    createExpenses,
    updateExpenses,
    deleteExpenses
} = require("../controllers/expense")


const router = express.Router()

router.get('/expenses', getExpenses)
router.post('/expense', createExpenses)
router.put('/expenses/:id', updateExpenses)
router.delete('/expenses/:id',deleteExpenses)

module.exports = router