const { Schema } = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userSchema = require('../../models/users.model')
const APIResponse = require('../../utils/APIResponse')
const log = require('../../Middlewares/log')
const logUser = require('../../utils/logUser')
const { INVALID_TOKEN_TIME } = require('../../constants/constants')



// ------------HELPERS-----------

const createToken = async (user) => {
    
    let token

    // if user don't have yet token we genrate a new token for him 
    //else we use the old token because it will expire in 6 month

    if (!user.token) {
        token = jwt.sign(
            { username: user.username },
            process.env.JTW_SECRET,
            { expiresIn: INVALID_TOKEN_TIME }
        )
        await userSchema.updateOne({ username: user.username }, { token })
    } else {
        token = user.token
    }

    return token
}



// ------------CONTROLLERS-----------

const connectUser = async (req, res) => {
    // we have already find the user in middaleware checkPassword
    // and put his data in req.user
    const user = req.user
    const { username } = req.body

    try {
        const token = await createToken(user)
        const data = { username, token }
        const message = `connected`
        const successResponse = APIResponse.success(data, message)
        res.cookie('jwt', token, { maxAge: INVALID_TOKEN_TIME, httpOnly: true });
        logUser(username)
        res.status(200).json(successResponse.toJSON())
        logUser(username)


    } catch (error) {
        console.log(error)
        const errorMessage = `Something went wrong: ${error.message}` // Capture de l'erreur
        const errorResponse = APIResponse.error({}, errorMessage)
        return res.status(500).json(errorResponse.toJSON())
    }
}

module.exports = connectUser