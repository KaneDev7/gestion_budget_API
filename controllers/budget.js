const { Schema } = require('mongoose')
const budgetSchema = require('../models/budget')

const getBudget = async (req, res) => {
    try {
        const result =await budgetSchema.find({})
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
}

const createBudget = async (req, res) => {
    const { montant } = req.body
 try {
     await budgetSchema.create({montant })
     res.status(201).json('budget created')
 } catch (error) {
     res.status(400).json(error)
 }
}

const updateBudget = async (req, res) => {
       const { montant } = req.body
    try {
        await budgetSchema.updateOne({montant })
        res.status(201).json('budget updated')
    } catch (error) {
        res.status(400).json(error)
    }
}


module.exports = {
    getBudget,
    createBudget,
    updateBudget
}