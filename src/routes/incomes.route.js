const express = require("express")
const router = express.Router()

const {
    getIncomes,
    createIncomes,
    deleteIncomes
} = require("../controllers/incomes.controller")


router.get('/api/incomes', getIncomes)
router.post('/api/income', createIncomes)
router.delete('/api/incomes/:id', deleteIncomes)

module.exports = router

