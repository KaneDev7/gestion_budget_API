const { Schema, default: mongoose} = require('mongoose')


const userShema = new Schema({
    username: {
        type: String,
        require : true,
        unique : true
    },

    password: {
        type: String,
        require: true
    },
    
    token: {
        type: String,
    },
})


module.exports = mongoose.model('User',userShema)
