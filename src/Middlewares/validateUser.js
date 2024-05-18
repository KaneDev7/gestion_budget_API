const APIResponse = require("../utils/APIResponse")
const userSchema = require('../models/users.model')
const bcrypt = require('bcrypt')



// ------------REGISTER-----------

const validateUserDataRegister = (req, res, next) => {
    const { username, password } = req.body

    if (!username || !password) {
        const message = `username or password can't be empty`
        const errorResponse = APIResponse.error({}, message)
        return res.status(401).json(errorResponse.toJSON())

    } else if (password.length < 5) {
        const message = `Le mot de passe doit avoir au minimum 5 caractère`
        const errorResponse = APIResponse.error({}, message)
        return res.status(401).json(errorResponse.toJSON())
    }
    next()
}



const checkUsernameInDb = async (req, res, next) => {
    const { username } = req.body
    const findUser = await userSchema.find({ username })

    if (findUser.length > 0) {
        const message = `username already exist`
        const errorResponse = APIResponse.error({}, message)
        return res.status(401).json(errorResponse.toJSON())
    }
    next()
}



// ------------LOGIN-----------

const validateUserDataLogin = async (req, res, next) => {
    const { username, password } = req.body

    if (!username || !password) {
        const message = `username or password can't be empty`
        const errorResponse = APIResponse.error({}, message)
        return res.status(401).json(errorResponse.toJSON())
    }

    const findUser = await userSchema.findOne({ username }, { _id: 0, username: 1, password: 1 })

    if (!findUser) {
        const message = `incorect username or password`
        const errorResponse = APIResponse.error({}, message)
        return res.status(401).json(errorResponse.toJSON())
    }
    next()
}


const checkPassword = async (req, res, next) => {
    const { username, password } = req.body

    const findUser = await userSchema.findOne({ username }, { _id: 0, username: 1, password: 1 })
    bcrypt.compare(password, findUser.password, async (error, match) => {
        if (error) {
            console.log(error)
        }

        if (!match) {
            const message = `incorect username or password`
            const errorResponse = APIResponse.error({}, message)
            return res.status(401).json(errorResponse.toJSON())
        }
        req.user = findUser
        next()
    })
}


module.exports = {
    validateUserDataRegister,
    checkUsernameInDb,
    validateUserDataLogin,
    checkPassword
}