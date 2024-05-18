
const jwt = require('jsonwebtoken')
const APIResponse = require('../utils/APIResponse')
const tokenSchema = require('../models/token.model')

const tokenID = 'token_id'


const findTokenInIvallidTokenList = async (token) => {

    const invalidTokenDoc = await tokenSchema.findOne({ tokenID }, { _id: 0 })

    if (invalidTokenDoc) {
        const invalidTokenArr = invalidTokenDoc.invalidToken
        return invalidTokenArr.includes(token)
    }
}


const verifyToken = async (req, res, next) => {
    if (req.url === '/auth') next() 

    let errorToken = 'invalid token'
    const token = req.headers.authorization?.split(' ')[1] ?? req?.cookies?.jwt

    if (!token) {
        const errorResponse = APIResponse.error({}, errorToken)
        return res.status(401).json(errorResponse.toJSON())
    }

    const isTokenInInvalidTokenList = await findTokenInIvallidTokenList(token)
    if (isTokenInInvalidTokenList) {
        const errorResponse = APIResponse.error({}, errorToken)
        return res.status(401).json(errorResponse.toJSON())
    }

    try {
        jwt.verify(token, process.env.JTW_SECRET, (error, decoded) => {
            if (error) {
                errorToken = error.message
                const errorResponse = APIResponse.error({},errorToken)
                return res.status(401).json(errorResponse.toJSON())
            }
            req.user = { username: decoded.username }
            next()
        })

    } catch (err) {
        console.log(err)
        const errorResponse = APIResponse.error(errorToken, {})
        return res.status(500).json(errorResponse.toJSON())
    }
}

module.exports = verifyToken