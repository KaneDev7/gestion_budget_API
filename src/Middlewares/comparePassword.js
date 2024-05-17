
const bcrypt = require('bcrypt')
const userSchema = require('../models/users.model')
const APIResponse = require('../utils/APIResponse')



const verifyPasswordInDb = (newPassword, currentPassword) =>{
    bcrypt.compare(newPassword, currentPassword, async (err, match) => {
        if (err) console.log(err)
    
        if (match) {
            const message = `the new password must be different from the current password`
            const errorResponse = APIResponse.error({}, message)
            return res.status(400).json(errorResponse.toJSON())
        }
    })
}

const comparePassword = async (req, res, next) => {
    const { username } = req.user
    const { currentPassword, newPassword } = req.body

    if(!newPassword){
        const errorMessage = `Something went wrong: new password not provided` // Capture de l'erreur
        const errorResponse = APIResponse.error({}, errorMessage)
        return res.status(500).json(errorResponse.toJSON())
    }

    const findUser = await userSchema.findOne({ username },{__id: 0})
    try {
        bcrypt.compare(currentPassword, findUser.password, async (err, match) => {
            if (err) console.log(err)
    
            if (!match) {
                const message = `incorrect password`
                const errorResponse = APIResponse.error({}, message)
                return res.status(400).json(errorResponse.toJSON())
            }

            verifyPasswordInDb(newPassword ,findUser.password)

            next()
        })
    } catch (error) {
        const errorMessage = `Something went wrong: ${error.message}` // Capture de l'erreur
        const errorResponse = APIResponse.error({}, errorMessage)
        return res.status(500).json(errorResponse.toJSON())
    }
}

module.exports = comparePassword