const express = require("express")

const {
    getExpenses,
    createExpenses,
    deleteExpenses
} = require("../controllers/expense.controller")


const router = express.Router()

router.get('/api/expenses', getExpenses)
router.post('/api/expense', createExpenses)
router.delete('/api/expenses/:id',deleteExpenses)

module.exports = router