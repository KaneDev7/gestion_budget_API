const { Schema } = require('mongoose')
const budgetSchema = require('../models/budget.model')
const financeShema = require('../models/finance.model')

const APIResponse = require('../utils/APIResponse')
const { getTotalExpense, getTotalIncomes } = require('../utils/operations')


const createBudget = async (req, res) => {
    const { montant } = req.body
    const { username } = req.user 

    if (!montant) {
        const message = `montant can't be empty`
        const errorResponse = APIResponse.error({}, message)
        return res.status(400).json(errorResponse.toJSON())
    }

    try {
        const totalExpense = await getTotalExpense(username)
        const totalIncome = await getTotalIncomes(username)
        await budgetSchema.findOneAndUpdate({ username }, {montant})
        const solde = (montant - totalExpense) + (totalIncome - totalExpense)
        await financeShema.findOneAndUpdate({ username }, { solde, budget : montant - totalExpense })

        const message = `budget and finance updated`
        const successResponse = APIResponse.success({}, message)
        res.status(201).json(successResponse.toJSON())

    } catch (error) {
        console.log(error)
        const errorMessage = `Something went wrong: ${error.message}` // Capture de l'erreur
        const errorResponse = APIResponse.error({}, errorMessage)
        return res.status(500).json(errorResponse.toJSON())
    }
}



module.exports = {
    createBudget,
}