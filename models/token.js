const { Schema, default: mongoose } = require('mongoose')



const tokenSchema = new Schema({
    tokenID : {
        type : String,
        default : 'token_id'
    },
    invalidToken: {
        type: [String]
    },
},)


module.exports = mongoose.model('Token', tokenSchema)
