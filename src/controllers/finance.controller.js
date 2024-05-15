const financeShema = require('../models/finance.model')
const APIResponse = require('../utils/APIResponse')


const getFinances = async (req, res) => {
    const { username } = req.user
    try {
        const result = await financeShema.find({username})
        const successResponse = APIResponse.success(result, '')
        res.status(200).json(successResponse.toJSON())

    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
}


module.exports = { getFinances}