
const bcrypt = require('bcrypt')
const userSchema = require('../models/users.model')
const APIResponse = require('../utils/APIResponse')


const comparePassword = async (req, res, next) => {
    const { username } = req.user
    const { currentPassword, newPassword } = req.body

    if (!newPassword) {
        const errorMessage = `Something went wrong: new password not provided` 
        const errorResponse = APIResponse.error({}, errorMessage)
        return res.status(500).json(errorResponse.toJSON())
    }

    const findUser = await userSchema.findOne({ username }, { __id: 0 })
    try {
        bcrypt.compare(currentPassword, findUser.password, async (err, match) => {
            if (err) console.log(err)

            if (!match) {
                const message = `incorrect password`
                const errorResponse = APIResponse.error({}, message)
                return res.status(400).json(errorResponse.toJSON())
            }

            req.user = {
                username,
                newPassword,
                passwordIndb: findUser.password
            }
            next()
        })
    } catch (error) {
        const errorMessage = `Something went wrong: ${error.message}` 
        const errorResponse = APIResponse.error({}, errorMessage)
        return res.status(500).json(errorResponse.toJSON())
    }
}

module.exports = comparePassword