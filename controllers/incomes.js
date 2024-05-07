
const incomeShema = require('../models/incomes')
const financeShema = require('../models/finace')
const { getTotalIncomes } = require("../utils/operations")
const APIResponse = require('../utils/APIResponse')

const getIncomes = async (req, res) => {
    try {
        const result = await incomeShema.find({})
        const message = `income created`
        const successResponse = APIResponse.success(result, message)
        res.status(200).json(successResponse.toJSON())

    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
}


const createIncomes = async (req, res) => {
    const { title, montant } = req.body

    if (!title || !montant) {
        const message = `title or montant can't be empty`
        const errorResponse = APIResponse.error({}, message)
        return res.status(400).json(errorResponse.toJSON())
    }

    try {
        await incomeShema.create({ title, montant })
        const totalIncome = await getTotalIncomes()
        await financeShema.updateOne({ totalIncome })

        const message = `income created and total income updated`
        const successResponse = APIResponse.success({}, message)
        res.status(201).json(successResponse.toJSON())
        
    } catch (error) {
        res.status(400).json(error)
    }
}


const updateIncomes = async (req, res) => {
    const { id } = req.params
    const { title, montant } = req.body

    if (!title || !montant) {
        const message = `title or montant can't be empty`
        const errorResponse = APIResponse.error({}, message)
        return res.status(400).json(errorResponse.toJSON())
    }

    try {
        const data = await incomeShema.findByIdAndUpdate(
            { _id: id },
            { $set: { title, montant } },
            { returnDocument: 'after' }
        )
        const message = `income for id ${data.id} income`
        const successResponse = APIResponse.success(data, message)
        res.status(201).json(successResponse.toJSON())

    } catch (error) {
        res.status(400).json(error)
    }
}



const deleteIncomes = async (req, res) => {
    const { id } = req.params

    if (!id) {
        const message = `cannot find id`
        const errorResponse = APIResponse.error({}, message)
        return res.status(400).json(errorResponse.toJSON())
    }

    try {
        await incomeShema.findByIdAndDelete({ _id: id })
        const totalIncome = await getTotalIncomes()
        await financeShema.updateOne({ totalIncome })

        const message = `income for id ${id} deleted and total income updated `
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
    updateIncomes,
    deleteIncomes
}
