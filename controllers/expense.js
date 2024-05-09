
const expenseShema = require('../models/expense')
const financeShema = require('../models/finace')
const budgetSchema = require('../models/budget')
const APIResponse = require('../utils/APIResponse')
const { getTotalExpense, getTotalIncomes } = require("../utils/operations")

const getExpenses = async (req, res) => {
    const { username } = req.user

    try {
        const result = await expenseShema.find({username})
        const successResponse = APIResponse.success(result, '')
        res.status(200).json(successResponse.toJSON())

    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
}


const createExpenses = async (req, res) => {

    const { title, montant } = req.body
    const { username } = req.user

    if (!title || !montant) {
        const message = `title or montant can't be empty`
        const errorResponse = APIResponse.error({}, message)
        return res.status(400).json(errorResponse.toJSON())
    }

    try {
        await expenseShema.create({title, montant, username })
        const budget = await budgetSchema.findOne({ username })
        const totalExpense = await getTotalExpense(username)
        const totalIncome = await getTotalIncomes(username)
        const solde = budget.montant + (totalIncome - totalExpense)
        await financeShema.findOneAndUpdate({username} ,{ totalExpense, solde })

        const message = `expense created solde and total expense updated`
        const successResponse = APIResponse.success({}, message)
        res.status(201).json(successResponse.toJSON())
    } catch (error) {
        res.status(400).json(error)
    }
}



const deleteExpenses = async (req, res) => {
    const {id} = req.params
    const { username } = req.user

    if(!id){
        const message = `cannot find id`
        const errorResponse = APIResponse.error({}, message)
        return res.status(400).json(errorResponse.toJSON())
    }

    try {
        await expenseShema.findOneAndDelete({username})
        const budget = await budgetSchema.findOne({ username })
        const totalIncome = await getTotalIncomes(username)
        const totalExpense = await getTotalExpense(username)
        const solde = budget.montant + (totalIncome - totalExpense)
        await financeShema.findOneAndUpdate({username} ,{ totalExpense, solde })
        
        const message = `expense for id ${id} deleted solde and total expense updated `
        const successResponse = APIResponse.success({}, message)
        res.status(200).json(successResponse.toJSON())
        
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
}

module.exports = {
    getExpenses,
    createExpenses,
    deleteExpenses,
}