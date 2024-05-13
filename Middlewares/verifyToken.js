
const jwt = require('jsonwebtoken')
const APIResponse = require('../utils/APIResponse')
const tokenSchema =  require('../models/token')

const tokenID = 'token_id'


const verifyToken = async (req, res, next) => {
    if(req.url === '/auth') next()

    let errorToken = null
    
    const token = req.headers.authorization.split(' ')[1]

    if(!token){
        errorToken = 'token invalid'
        const errorResponse = APIResponse.error(errorToken, {})
        return res.status(400).json(errorResponse.toJSON())
    }

     const  invalidTokenDoc = await tokenSchema.findOne({tokenID})

     console.log(invalidTokenDoc)
     if(invalidTokenDoc){
        const invalidTokenArr =  invalidTokenDoc.invalidToken
        console.log('invalidToken',invalidTokenArr)

        if(invalidTokenArr.includes(token)){
            errorToken = 'token invalid'
            const errorResponse = APIResponse.error(errorToken, {})
            return res.status(400).json(errorResponse.toJSON())
        }
     }

    try {
        jwt.verify(token, process.env.JTW_SECRET, (error, decoded) => {
            if (error) {
                errorToken = error
                const errorResponse = APIResponse.error(errorToken, {})
                return res.status(400).json(errorResponse.toJSON())
            }
            req.user = { username: decoded.username }
            next()

        })
    } catch (err) {
        console.log(err)
        const errorResponse = APIResponse.error(errorToken, {})
        return res.status(400).json(errorResponse.toJSON())

    }



}

module.exports = verifyToken