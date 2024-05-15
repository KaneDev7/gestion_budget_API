const { Schema } = require('mongoose')
const bcrypt = require('bcrypt')
const userSchema = require('../../models/users.model')
const financeShema = require('../../models/finance.model')
const budgetShema = require('../../models/budget.model')


const APIResponse = require('../../utils/APIResponse')
const { SALT_ROUNDS } = require('../../constants/constants')


const createUser = async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        const message = `username or password can't be empty`
        const errorResponse = APIResponse.error({}, message)
        return res.status(400).json(errorResponse.toJSON())
    }

    try {
        const findUser = await userSchema.find({username})

        if(findUser.length > 0){
            const message = `username already exist`
            const errorResponse = APIResponse.error({}, message)
            return res.status(400).json(errorResponse.toJSON())
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        userSchema.create({ username, password: passwordHash, token : '' })
        budgetShema.create({username, montant : 0})
        financeShema.create({username, totalExpense:0, totalIncome:0, solde: 0})
        
        const message = `user created`
        const successResponse = APIResponse.success({}, message)
        res.status(201).json(successResponse.toJSON())

    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
}

module.exports = createUser