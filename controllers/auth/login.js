const { Schema } = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userSchema = require('../../models/users')
const APIResponse = require('../../utils/APIResponse')


const connectUser = async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        const message = `username or password can't be empty`
        const errorResponse = APIResponse.error({}, message)
        return res.status(400).json(errorResponse.toJSON())
    }

    try {
        const findUser = await userSchema.findOne({ username })

        if (!findUser) {
            const message = `incorect username or password`
            const errorResponse = APIResponse.error({}, message)
            return res.status(400).json(errorResponse.toJSON())
        }

        const match = bcrypt.compare(findUser.password, password);
        console.log(match)

        if (!match) {
            const message = `incorect username or password`
            const errorResponse = APIResponse.error({}, message)
            return res.status(400).json(errorResponse.toJSON())
        }

        let token

        if (!findUser.token) {
            console.log('new token create')
            token = jwt.sign(
                { username },
                process.env.JTW_SECRET
            )
            await userSchema.updateOne({ username }, {token})
        } else {
            console.log('old token')
            token = findUser.token
        }

        const data = { token }
        const message = `connected`
        const successResponse = APIResponse.success(data, message)
        res.status(201).json(successResponse.toJSON())

    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
}

module.exports = connectUser