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
router.put('/income', updateIncomes)
router.delete('/income', deleteIncomes)

module.exports = router

