
const expenseShema = require('../models/expense')
const financeShema = require('../models/finace')
const { getTotalExpense } = require("../utils/utils")

const getExpenses = async (req, res) => {
    try {
        const result = await expenseShema.find({})
        res.status(200).json(result)

    } catch (error) {
        console.log(error)
    }
}

const createExpenses = async (req, res) => {
    const { title, montant } = req.body
    try {
        await expenseShema.create({ title, montant })
        const totalExpense = await getTotalExpense()
        await financeShema.updateOne({ totalExpense })
        res.status(201).json('expense created and totalExpense updated')
    } catch (error) {
        res.status(400).json(error)
    }
}

const updateExpenses = async (req, res) => {
    res.send('put expenses')
}

const deleteExpenses = async (req, res) => {
    res.send('delete expenses')
}

module.exports = {
    getExpenses,
    createExpenses,
    deleteExpenses,
    updateExpenses
}