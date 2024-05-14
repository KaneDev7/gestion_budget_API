const userSchema = require('../models/users.model')
const bcrypt = require('bcrypt')
const APIResponse = require('../utils/APIResponse')
const { SALT_ROUNDS } = require('../constants/constants')


const updatePassword = async (req, res) => {
    const { username } = req.user
    const { currentPassword, newPassword } = req.body

    console.log({
        username,
        currentPassword,
        newPassword
    })

    try {

        const findUser = await userSchema.findOne({ username })

        console.log('findUser', findUser)

        bcrypt.compare(currentPassword, findUser.password, async (err, match) => {
            console.log('match', match)
            if (err) {
                console.log(err)
            }
            if (!match) {
                const message = `incorrect password`
                const errorResponse = APIResponse.error({}, message)
                return res.status(400).json(errorResponse.toJSON())
            }

            bcrypt.compare(newPassword, findUser.password, async (err, match) => {
                console.log('match', match)
                if (err) {
                    console.log(err)
                }
                if (match) {
                    const message = `the new password must be different from the current password`
                    const errorResponse = APIResponse.error({}, message)
                    return res.status(400).json(errorResponse.toJSON())
                }
    
                const newPasswordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
                await userSchema.updateOne({ username }, { password: newPasswordHash })
                const message = `your password is changed`
                const successResponse = APIResponse.success({}, message)
                res.status(201).json(successResponse.toJSON())
            })
        })


    

    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
}

module.exports = {
    updatePassword
}