const express = require("express")
const router = express.Router()

const {
    getIncomes,
    createIncomes,
    deleteIncomes
} = require("../controllers/incomes")


router.get('/incomes', getIncomes)
router.post('/income', createIncomes)
router.delete('/incomes/:id', deleteIncomes)

module.exports = router

