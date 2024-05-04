const { Schema, default: mongoose} = require('mongoose')


const userShema = new Schema({
    username: {
        type: String,
    },
    password: {
        type: String,
    },
    token: {
        type: String,
    },
})


module.exports = mongoose.model('User',userShema)
