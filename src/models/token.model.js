const { Schema, default: mongoose } = require('mongoose')



const tokenSchema = new Schema({
    tokenID : {
        type : String,
        default : 'token_id'
    },
    invalidToken: {
        type: [String]
    },

    createdAt: {
        type: Date,
        default: Date.now 
    },
},)


module.exports = mongoose.model('Token', tokenSchema)
