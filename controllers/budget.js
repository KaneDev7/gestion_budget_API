const { Schema } = require('mongoose')
const budgetSchema = require('../models/budget')
const APIResponse = require('../utils/APIResponse')

const getBudget = async (req, res) => {
    try {
        const result = await budgetSchema.find({})
        const message = ``
        const successResponse = APIResponse.success(result, message)
        res.status(201).json(successResponse.toJSON())
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
}

const createBudget = async (req, res) => {
    const { montant } = req.body

    if (!montant) {
        const message = `montant can't be empty`
        const errorResponse = APIResponse.error({}, message)
        return res.status(400).json(errorResponse.toJSON())
    }

    try {
        const budget = await budgetSchema.find({})

        if (!budget.length) {
            await budgetSchema.create({ montant })
        } else {
            await budgetSchema.updateOne({ montant })
        }
        const message = `budget created`
        const successResponse = APIResponse.success({}, message)
        res.status(201).json(successResponse.toJSON())

    } catch (error) {
        const message = `montant can't be empty`
        const errorResponse = APIResponse.error({}, message)
        return res.status(400).json(errorResponse.toJSON())
    }
}



module.exports = {
    getBudget,
    createBudget,
}