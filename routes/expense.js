const express = require("express")

const {
    getExpenses,
    createExpenses,
    deleteExpenses
} = require("../controllers/expense")


const router = express.Router()


router.get('/expenses', getExpenses)
router.post('/expense', createExpenses)
router.delete('/expenses/:id',deleteExpenses)

module.exports = router