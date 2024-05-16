
const expenseShema = require('../models/expense.model')
const financeShema = require('../models/finance.model')
const budgetSchema = require('../models/budget.model')

const APIResponse = require('../utils/APIResponse')
const { getTotalExpense, getTotalIncomes } = require("../utils/operations")
const { PAGE_LIMIT } = require('../constants/constants')


// ------------HELPER-----------


const findExpensesByFilterAndSort = async ({ limit, page, gt, lt, sort }, username) => {

    if (!username) return
    const projection = { montant: 1 , title : 1, createdAt : 1, createdAt : 1}

    let result

    if (gt && lt) {
        result = await expenseShema.find({ username })
            .gt('montant', gt)
            .lt('montant', lt)
            .sort(sort && { montant: sort })
            .select(projection)

    } else if (gt && !lt) {
        result = await expenseShema.find({ username })
            .gt('montant', gt)
            .sort(sort && { montant: sort })
            .select(projection)

    } else if (!gt && lt) {
        result = await expenseShema.find({ username })
            .lt('montant', lt)
            .sort(sort && { montant: sort })
            .select(projection)

    } else {
        result = await expenseShema.find({ username })
            .skip(page - 1)
            .limit(limit || PAGE_LIMIT)
            .sort(sort && { montant: sort })
            .select(projection)
    }

    return result
}


const updateFinanceAfterExpensesChanged = async (username) => {
    if (!username) return

    const budget = await budgetSchema.findOne({ username })
    const totalExpense = await getTotalExpense(username)
    const totalIncome = await getTotalIncomes(username)

    const solde = budget.montant + (totalIncome - totalExpense)
    const bdgetUpdate = budget.montant - totalExpense
    await financeShema.findOneAndUpdate({ username }, { totalExpense, solde })
    await budgetSchema.findOneAndUpdate({ username }, { montant: bdgetUpdate })
}



const getExpenses = async (req, res) => {
    const { username } = req.user

    try {
        const result = await findExpensesByFilterAndSort(req.query, username)

        if (result.length < 1) {
            const message = `no data fond`
            const successResponse = APIResponse.success({}, message)
            return res.status(200).json(successResponse.toJSON())
        }

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
        await expenseShema.create({ title, montant, username })
        await updateFinanceAfterExpensesChanged(username)

        const message = `expense created, budget, solde and total expense updated`
        const successResponse = APIResponse.success({}, message)
        res.status(201).json(successResponse.toJSON())

    } catch (error) {
        console.log(error)
        const errorMessage = `Error creating income: ${error.message}` // Capture de l'erreur
        const errorResponse = APIResponse.error({}, errorMessage)
        return res.status(500).json(errorResponse.toJSON())
    }
}



const deleteExpenses = async (req, res) => {
    const { id } = req.params
    const { username } = req.user

    if (!id) {
        const message = `cannot find id`
        const errorResponse = APIResponse.error({}, message)
        return res.status(400).json(errorResponse.toJSON())
    }

    try {
        await expenseShema.findOneAndDelete({ username })
        await updateFinanceAfterExpensesChanged(username)

        const message = `expense for id ${id} deleted solde and total expense updated `
        const successResponse = APIResponse.success({}, message)
        res.status(200).json(successResponse.toJSON())

    } catch (error) {
        console.log(error)
        const errorMessage = `Error deleting income: ${error.message}` // Capture de l'erreur
        const errorResponse = APIResponse.error({}, errorMessage)
        return res.status(500).json(errorResponse.toJSON()) 
    }
}

module.exports = {
    getExpenses,
    createExpenses,
    deleteExpenses,
}