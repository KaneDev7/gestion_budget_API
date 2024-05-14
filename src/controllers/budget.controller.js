const { Schema } = require('mongoose')
const budgetSchema = require('../models/budget.model')
const financeShema = require('../models/finance.model')

const APIResponse = require('../utils/APIResponse')
const { getTotalExpense, getTotalIncomes } = require('../utils/operations')

const getBudget = async (req, res) => {
    const { username } = req.user
    try {
        const result = await budgetSchema.find({ username })
        const successResponse = APIResponse.success(result, '')
        res.status(201).json(successResponse.toJSON())
    } catch (error) {
        res.status(400).json(error)
    }
}

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

        await budgetSchema.findOneAndUpdate({ username }, {
            montant: montant - totalExpense
        })

        const solde = (montant - totalExpense) + (totalIncome - totalExpense)
        await financeShema.findOneAndUpdate({ username }, { solde })

        const message = `budget and solde updated`
        const successResponse = APIResponse.success({}, message)
        res.status(201).json(successResponse.toJSON())

    } catch (error) {
        console.log(error)
        const errorResponse = APIResponse.error(error, '')
        return res.status(400).json(errorResponse.toJSON())
    }
}



module.exports = {
    getBudget,
    createBudget,
}