const { Schema } = require('mongoose')
const budgetSchema = require('../models/budget')
const APIResponse = require('../utils/APIResponse')

const getBudget = async (req, res) => {
    const {username} = req.user
    try {
        const result = await budgetSchema.find({username})
        const successResponse = APIResponse.success(result, '')
        res.status(201).json(successResponse.toJSON())
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
        const budget = await budgetSchema.find({username})

        if (!budget.length) {
            await budgetSchema.create({ montant, username})
        } else {    
            await budgetSchema.findOneAndUpdate({username}, {montant})
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