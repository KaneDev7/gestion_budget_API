const userSchema = require('../../models/users.model')
const tokenSchema = require('../../models/token.model')
const APIResponse = require('../../utils/APIResponse')
const jwt = require('jsonwebtoken')
const { INVALID_TOKEN_TIME } = require('../../constants/constants')
const { pushTokenToInvalidsTokensList } = require('../../utils/token')


const generateNewToken = async (req, res) => {

    const currentToken = req.headers.authorization?.split(' ')[1] ?? req?.cookies?.jwt
    const { username } = req.user

    if (!currentToken) {
        const errorResponse = APIResponse.error('token invalid', {})
        return res.status(400).json(errorResponse.toJSON())
    }

    await pushTokenToInvalidsTokensList(currentToken)
    
    try {
        const token = jwt.sign(
            { username },
            process.env.JTW_SECRET,
            { expiresIn: INVALID_TOKEN_TIME }
        )

        await userSchema.findOneAndUpdate({ username }, { token })

        const data = { username, token }
        const message = `New token is generated`
        const successResponse = APIResponse.success(data, message)
        res.cookie('jwt', token, { maxAge: INVALID_TOKEN_TIME, httpOnly: true });
        res.status(200).json(successResponse.toJSON())

    } catch (error) {
        console.log(error)
        const errorMessage = `Something went wrong: ${error.message}` 
        const errorResponse = APIResponse.error({}, errorMessage)
        return res.status(500).json(errorResponse.toJSON())
    }

}




const getToken = async (req, res) => {
    const { username } = req.user

    try {
        const findUserToken = await userSchema.findOne({ username }, { token: 1, _id: 0 })
        const successResponse = APIResponse.success(findUserToken, '')
        res.status(201).json(successResponse.toJSON())

    } catch (error) {
        console.log(error)
        const errorMessage = `Something went wrong: ${error.message}` // Capture de l'erreur
        const errorResponse = APIResponse.error({}, errorMessage)
        return res.status(500).json(errorResponse.toJSON())
    }

}


module.exports = {
    generateNewToken,
    getToken,
}   