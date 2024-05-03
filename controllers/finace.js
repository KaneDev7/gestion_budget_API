const financeShema = require('../models/finace')


const getFinances = async (req, res) => {
    try {
        const result = await financeShema.find({})
        res.status(200).json(result)

    } catch (error) {
        res.status(400).json(error)
    }
}

module.exports = {getFinances}