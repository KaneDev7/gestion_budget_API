const { TOEKN_ID } = require("../constants/constants")
const tokenSchema = require('../models/token.model')

const setTokenToInvalidsTokens = async (token) =>{
    
    await tokenSchema.findOneAndUpdate({ tokenID : TOEKN_ID },
        { $addToSet: { invalidToken: token } },
        { new: true, upsert: true }
    )
}

module.exports = {
    setTokenToInvalidsTokens
}