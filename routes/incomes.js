const express = require("express")
const router = express.Router()

const {
    getIncomes,
    createIncomes,
    updateIncomes,
    deleteIncomes
} = require("../controllers/incomes")


router.get('/incomes', getIncomes)
router.post('/income', createIncomes)
router.put('/incomes/:id', updateIncomes)
router.delete('/incomes/:id', deleteIncomes)

module.exports = router

