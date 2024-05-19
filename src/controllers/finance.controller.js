const financeShema = require('../models/finance.model')
const APIResponse = require('../utils/APIResponse')


const getFinances = async (req, res) => {
    const { username } = req.user
    try {
        const result = await financeShema.find({username}, {username : 0, _id : 0})
        const successResponse = APIResponse.success(result, '')
        res.status(200).json(successResponse.toJSON())

    } catch (error) {
        console.log(error)
        const errorMessage = `Something went wrong: ${error.message}` // Capture de l'erreur
        const errorResponse = APIResponse.error({}, errorMessage)
        return res.status(500).json(errorResponse.toJSON())
    }
}

module.exports = { getFinances}