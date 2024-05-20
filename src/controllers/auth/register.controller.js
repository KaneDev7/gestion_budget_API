const { Schema } = require('mongoose')
const bcrypt = require('bcrypt')
const userSchema = require('../../models/users.model')
const financeShema = require('../../models/finance.model')
const budgetShema = require('../../models/budget.model')

const APIResponse = require('../../utils/APIResponse')
const { SALT_ROUNDS } = require('../../constants/constants')

 
// ------------HELPER-----------
const createAndInitDataforNewUser = async (password, username) => {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
   await userSchema.create({ username, password: passwordHash, token : '' })
   await budgetShema.create({username, montant : 0})
   await financeShema.create({username, totalExpense:0, totalIncome:0, solde: 0, budget : 0})
}

// ------------CONTROLLERS-----------
const createUser = async (req, res) => {
    const { username, password } = req.body

    try {
        await createAndInitDataforNewUser(password, username)
        const message = `user created`
        const successResponse = APIResponse.success({}, message)
        res.status(201).json(successResponse.toJSON())

    } catch (error) {
        console.log('error', error)
        const errorMessage = `Something went wrong: ${error.message}` 
        const errorResponse = APIResponse.error({}, errorMessage)
        return res.status(500).json(errorResponse.toJSON())
    }
}

module.exports = createUser