const { Schema } = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userSchema = require('../../models/users.model')
const APIResponse = require('../../utils/APIResponse')
const log = require('../../Middlewares/log')
const logUser = require('../../utils/logUser')
const { INVALID_TOKEN_TIME } = require('../../constants/constants')


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

        bcrypt.compare(password,findUser.password, async (error, match) =>{

            if(error){
                console.log(error)
            }

            if (!match) {
                const message = `incorect username or password`
                const errorResponse = APIResponse.error({}, message)
                return res.status(400).json(errorResponse.toJSON())
            }

            let token

            if (!findUser.token) {
                token = jwt.sign(
                    { username },
                    process.env.JTW_SECRET,
                    {expiresIn : INVALID_TOKEN_TIME}
                )
                await userSchema.updateOne({ username }, {token})
            } else {
                token = findUser.token
            }
    
            const data = { username, token }
            const message = `connected`
            const successResponse = APIResponse.success(data, message)
            res.cookie('jwt', token, { maxAge: INVALID_TOKEN_TIME, httpOnly: true});
            res.status(200).json(successResponse.toJSON())
            logUser(username)
        })

    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
}

module.exports = connectUser