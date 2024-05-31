const bcrypt = require('bcrypt')
const APIResponse = require('../utils/APIResponse')


const verifyPasswordInDb = (req, res, next) => {
    const { newPassword, passwordIndb } = req.user

    try {
        bcrypt.compare(newPassword, passwordIndb, async (err, match) => {
            if (err) console.log(err)

            if (match) {
                const message = `the new password must be different from the current password`
                const errorResponse = APIResponse.error({}, message)
                return res.status(400).json(errorResponse.toJSON())
            }
            next()
        })
    } catch (error) {
        console.log(error)
        const errorMessage = `Something went wrong: ${error.message}` // Capture de l'erreur
        const errorResponse = APIResponse.error({}, errorMessage)
        return res.status(500).json(errorResponse.toJSON())
    }
}

module.exports = { verifyPasswordInDb }