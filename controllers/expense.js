
const expenseShema = require('../models/expense')
const financeShema = require('../models/finace')
const APIResponse = require('../utils/APIResponse')
const { getTotalExpense } = require("../utils/operations")

const getExpenses = async (req, res) => {
    try {
        const result = await expenseShema.find({})
        const message = `expense created`
        const successResponse = APIResponse.success(result, message)
        res.status(201).json(successResponse.toJSON())
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
}


const createExpenses = async (req, res) => {
    const { title, montant } = req.body

    if (!title || !montant) {
        const message = `title or montant can't be empty`
        const errorResponse = APIResponse.error({}, message)
        return res.status(400).json(errorResponse.toJSON())
    }

    try {
        await expenseShema.create({title, montant })
        const totalExpense = await getTotalExpense()
        await financeShema.updateOne({ totalExpense })
        const message = `expense created and totalExpense updated`
        const successResponse = APIResponse.success({}, message)
        res.status(201).json(successResponse.toJSON())
    } catch (error) {
        res.status(400).json(error)
    }
}

const updateExpenses = async (req, res) => {
    const { id } = req.params
    const { title, montant } = req.body

    if (!title || !montant) {
        const message = `title or montant can't be empty`
        const errorResponse = APIResponse.error({}, message)
        return res.status(400).json(errorResponse.toJSON())
    }

    try {
        const data = await expenseShema.findByIdAndUpdate(
            { _id: id },
            {$set: { title, montant }},
            { returnDocument: 'after' }
        )
        const message = `expense for id ${data.id} updated`
        const successResponse = APIResponse.success(data, message)
        res.status(201).json(successResponse.toJSON())
    } catch (error) {
        res.status(400).json(error)
    }
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