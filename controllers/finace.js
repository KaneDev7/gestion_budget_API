const financeShema = require('../models/finace')


const getFinances = async (req, res) => {
    try {
        const result = await financeShema.find({})
        const message = ``
        const successResponse = APIResponse.success(result, message)
        res.status(200).json(successResponse.toJSON())
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
}

module.exports = { getFinances }