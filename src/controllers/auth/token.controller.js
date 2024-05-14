const userSchema = require('../../models/users.model')
const tokenSchema = require('../../models/token.model')
const APIResponse = require('../../utils/APIResponse')
const jwt = require('jsonwebtoken')

const tokenID = 'token_id'
const ivalidTokenTiime = 6 * 30 * 24 * 60 * 60 * 1000 // 6 mois

const generateNewToken = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const { username } = req.user

    if (!token) {
        const errorResponse = APIResponse.error('token invalid', {})
        return res.status(400).json(errorResponse.toJSON())
    }

    await tokenSchema.findOneAndUpdate({ tokenID },
        { $addToSet: { invalidToken: token } },
        { new: true, upsert: true }
    )


    try {
        const token = jwt.sign(
            { username },
            process.env.JTW_SECRET,
            { expiresIn: ivalidTokenTiime }
        )

        await userSchema.findOneAndUpdate({ username }, { token })

        const data = { token }
        const message = `A new token is generated for ${username}`
        const successResponse = APIResponse.success(data, message)
        res.status(201).json(successResponse.toJSON())

    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }

}

const getToken = async (req, res) => {
    const { username } = req.user

    try {
        const findUserToken = await userSchema.findOne({ username }, { token: 1, _id: 0 })
        console.log('findUserToken', findUserToken  )
        const successResponse = APIResponse.success(findUserToken, '')
        res.status(201).json(successResponse.toJSON())

    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }

}


module.exports = {
    generateNewToken,
    getToken,
}   