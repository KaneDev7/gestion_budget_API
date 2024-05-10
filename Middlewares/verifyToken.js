
const jwt = require('jsonwebtoken')
const APIResponse = require('../utils/APIResponse')

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
    let errorToken = {}
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