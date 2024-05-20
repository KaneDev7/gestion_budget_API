const { TOEKN_ID } = require("../constants/constants")
const tokenSchema = require('../models/token.model')

const pushTokenToInvalidsTokensList = async (token) =>{
    await tokenSchema.findOneAndUpdate({ tokenID : TOEKN_ID },
        { $addToSet: { invalidToken: token } },
        { new: true, upsert: true }
    )
}

module.exports = {
    pushTokenToInvalidsTokensList
}