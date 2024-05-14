const { Schema } = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userSchema = require('../../models/users.model')
const APIResponse = require('../../utils/APIResponse')
const log = require('../../Middlewares/log')
const logUser = require('../../utils/logUser')


const ivalidTokenTiime = 6 * 30 * 24 * 60 * 60 * 1000 // 6 mois


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
                    {expiresIn : ivalidTokenTiime}
                )
                await userSchema.updateOne({ username }, {token})
            } else {
                token = findUser.token
            }
    
            const data = { token }
            const message = `connected`
            const successResponse = APIResponse.success(data, message)
            res.status(201).json(successResponse.toJSON())
            logUser(username)
        })




    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
}

module.exports = connectUser