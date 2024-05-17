const userSchema = require('../models/users.model')
const expenseShema = require('../models/expense.model')
const incomeShema = require('../models/incomes.model')
const financeShema = require('../models/finance.model')
const budgetSchema = require('../models/budget.model')


const bcrypt = require('bcrypt')
const APIResponse = require('../utils/APIResponse')
const { SALT_ROUNDS } = require('../constants/constants')


const updatePassword = async (req, res) => {
    const { username } = req.user
    const { newPassword } = req.body

    try {
        const newPasswordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
        await userSchema.updateOne({ username }, { password: newPasswordHash })
        const message = `your password is changed`
        const successResponse = APIResponse.success({}, message)
        res.status(201).json(successResponse.toJSON())

    } catch (error) {
        console.log(error)
        const errorMessage = `Something went wrong: ${error.message}` // Capture de l'erreur
        const errorResponse = APIResponse.error({}, errorMessage)
        return res.status(500).json(errorResponse.toJSON())
    }
}


const deleteUser = async (req, res) => {
    const { username } = req.user
    try {
        await userSchema.deleteOne({ username })
        await expenseShema.deleteMany({ username })
        await incomeShema.deleteMany({ username })
        await financeShema.deleteMany({ username })
        await budgetSchema.deleteMany({ username })
        await financeShema.deleteMany({ username })

        const message = `Your acount is deleted`
        const successResponse = APIResponse.success({}, message)
        res.cookie('jwt', '', { maxAge: 1, httpOnly: true });
        res.status(200).json(successResponse.toJSON())

    } catch (error) {
        console.log(error)
        const errorMessage = `Something went wrong: ${error.message}` // Capture de l'erreur
        const errorResponse = APIResponse.error({}, errorMessage)
        return res.status(500).json(errorResponse.toJSON())
    }
}

module.exports = {
    updatePassword,
    deleteUser
}