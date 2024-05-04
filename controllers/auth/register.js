const { Schema } = require('mongoose')
const bcrypt = require('bcrypt')
const userSchema = require('../../models/users')
const APIResponse = require('../../utils/APIResponse')

const SALT_ROUNDS = 10;

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
            const message = `username already taken`
            const errorResponse = APIResponse.error({}, message)
            return res.status(400).json(errorResponse.toJSON())
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        userSchema.create({ username, password: passwordHash, token : '' })
        const message = `user created`
        const successResponse = APIResponse.success({}, message)
        res.status(201).json(successResponse.toJSON())

    } catch (error) {
        res.status(400).json(error)
    }
}

module.exports = createUser