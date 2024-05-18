
const incomeShema = require('../models/incomes.model')
const financeShema = require('../models/finance.model')
const budgetSchema = require('../models/budget.model')

const { getTotalIncomes, getTotalExpense } = require("../utils/operations")
const APIResponse = require('../utils/APIResponse')
const { PAGE_LIMIT } = require('../constants/constants')



// ------------HELPER-----------

const findIncomesByFilterAndSort = async ({ limit, page, gt, lt, sort }, username) => {

    if (!username) return
    const projection = {montant: 1 , title : 1}
    let result

    if (gt && lt) {
        result = await incomeShema.find({ username })
            .gt('montant', gt)
            .lt('montant', lt)
            .sort(sort && { montant: sort })
            .select(projection)
    } else if (gt && !lt) {
        result = await incomeShema.find({ username })
            .gt('montant', gt)
            .sort(sort && { montant: sort })
            .select(projection)

    } else if (!gt && lt) {
        result = await incomeShema.find({ username })
            .lt('montant', lt)
            .sort(sort && { montant: sort })
            .select(projection)

    } else {
        result = await incomeShema.find({ username })
            .skip(page)
            .limit(limit || PAGE_LIMIT)
            .sort(sort && { montant: sort })
            .select(projection)
    }

    return result
}


const updateFinanceAfterIncomeChanged = async (username) => {
    if (!username) return
    const budget = await budgetSchema.findOne({ username })
    const totalIncome = await getTotalIncomes(username)
    const totalExpense = await getTotalExpense(username)
    const solde = budget.montant + (totalIncome - totalExpense)
    await financeShema.findOneAndUpdate({ username }, { totalIncome, solde })
}



// ------------CONTROLLERS FONCTION-----------

const getIncomes = async (req, res) => {
    const { username } = req.user

    try {
        const result = await findIncomesByFilterAndSort(req.query, username)

        if (result.length < 1) {
            const message = `no data fnd in your incomes`
            const successResponse = APIResponse.success({}, message)
            return res.status(200).json(successResponse.toJSON())
        }
        const successResponse = APIResponse.success(result, '')
        res.status(200).json(successResponse.toJSON())

    } catch (error) {
        console.log(error)

    }
}



const createIncomes = async (req, res) => {
    const { title, montant } = req.body
    const { username } = req.user
    
    try {
        await incomeShema.create({ title, montant, username })
        await updateFinanceAfterIncomeChanged(username)

        const message = `income created solde and total income updated`
        const successResponse = APIResponse.success({}, message)
        return res.status(201).json(successResponse.toJSON())

    } catch (error) {
        console.log(error)
        const errorMessage = `Error creating income: ${error.message}`
        const errorResponse = APIResponse.error({}, errorMessage)
        return res.status(500).json(errorResponse.toJSON())
    }
}



const deleteIncomes = async (req, res) => {
    const { id } = req.params
    const { username } = req.user

    if (!id) {
        const message = `cannot find id`
        const errorResponse = APIResponse.error({}, message)
        return res.status(400).json(errorResponse.toJSON())
    }

    try {
        await incomeShema.findOneAndDelete({ username })
        await updateFinanceAfterIncomeChanged()

        const message = `income for id ${id} deleted solde and total income updated `
        const successResponse = APIResponse.success({}, message)
        res.status(200).json(successResponse.toJSON())

    } catch (error) {
        console.log(error)
        const errorMessage = `Error deleting income: ${error.message}`
        const errorResponse = APIResponse.error({}, errorMessage)
        return res.status(500).json(errorResponse.toJSON())
    }
}


module.exports = {
    getIncomes,
    createIncomes,
    deleteIncomes
}