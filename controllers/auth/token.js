const userSchema = require('../../models/users')
const tokenSchema =  require('../../models/token')
const APIResponse = require('../../utils/APIResponse')
const jwt = require('jsonwebtoken')

const tokenID = 'token_id'

const generateNewToken = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const { username } = req.user

    if(!token){
        const errorResponse = APIResponse.error('token invalid', {})
        return res.status(400).json(errorResponse.toJSON())
    }

    await tokenSchema.findOneAndUpdate({tokenID},
        {$addToSet : {invalidToken : token}},
        {new : true, upsert: true}   
    ) 
     
    
    try {
        const token = jwt.sign(
            { username },
            process.env.JTW_SECRET
        )

        await userSchema.findOneAndUpdate({ username }, {token})

        const data = { token }
        const message = `A new token is generated for ${username}`
        const successResponse = APIResponse.success(data, message)
        res.status(201).json(successResponse.toJSON())

    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }

}

module.exports = generateNewToken