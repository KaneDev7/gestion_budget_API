
const incomeShema = require('../models/incomes')
const financeShema = require('../models/finace')
const { getTotalIncomes } = require("../utils/utils")

const getIncomes = async (req, res) => {
    try {
        const result = await incomeShema.find({})
        res.status(200).json(result)

    } catch (error) {
        console.log(error)
    }
}

const createIncomes = async (req, res) => {
    const { title, montant } = req.body
    try {
        await incomeShema.create({ title, montant })
        const totalIncome = await getTotalIncomes()
        await financeShema.updateOne({ totalIncome })
        res.status(201).json('income created and totalIncome updated')
    } catch (error) {
        res.status(400).json(error)
    }
}

const updateIncomes = async (req, res) => {
    res.send('put income')
}

const deleteIncomes = async (req, res) => {
    res.send('delete income')
}

module.exports = {
    getIncomes,
    createIncomes,
    updateIncomes,
    deleteIncomes
}
