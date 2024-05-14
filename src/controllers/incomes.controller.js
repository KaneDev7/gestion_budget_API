
const incomeShema = require('../models/incomes.model')
const financeShema = require('../models/finance.model')
const budgetSchema = require('../models/budget.model')

const { getTotalIncomes, getTotalExpense } = require("../utils/operations")
const APIResponse = require('../utils/APIResponse')

const getIncomes = async (req, res) => {

    const { username } = req.user
    try {
        const result = await incomeShema.find({username})

        if(result.length < 1){
            const message = `no data find in your incomes`
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


const createIncomes = async (req, res) => {

    const { title, montant } = req.body
    const { username } = req.user

    if (!title || !montant) {
        const message = `title or montant can't be empty`
        const errorResponse = APIResponse.error({}, message)
        return res.status(400).json(errorResponse.toJSON())
    }

    try {
        await incomeShema.create({ title, montant, username })
        const budget = await budgetSchema.findOne({ username })
        const totalIncome = await getTotalIncomes(username)
        const totalExpense = await getTotalExpense(username)

        const solde = budget.montant + (totalIncome - totalExpense)
        await financeShema.findOneAndUpdate({username} ,{ totalIncome, solde })

        const message = `income created solde and total income updated`
        const successResponse = APIResponse.success({}, message)
       return res.status(201).json(successResponse.toJSON())

    } catch (error) {
        console.log(error)
        res.status(400).json(error)
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
        const findIncomes = await incomeShema.find({username})
        
        if(findIncomes.length > 0){
            const message = `no data find in your incomes`
            const successResponse = APIResponse.success({}, message)
            return res.status(204).json(successResponse.toJSON())
        }

        await incomeShema.findOneAndDelete({username})
        const totalIncome = await getTotalIncomes(username)
        const totalExpense = await getTotalExpense(username)
        const solde = budget.montant + (totalIncome - totalExpense)
        await financeShema.findOneAndUpdate({username} ,{ totalIncome, solde })

        const message = `income for id ${id} deleted solde and total income updated `
        const successResponse = APIResponse.success({}, message)
        res.status(200).json(successResponse.toJSON())

    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
}


module.exports = {
    getIncomes,
    createIncomes,
    deleteIncomes
}