const { Schema, default: mongoose} = require('mongoose')


const userShema = new Schema({
    username: {
        type: String,
        require : true,
        unique : true,
    },

    password: {
        type: String,
        require: true,
        minLength : [3, 'The password must have at least three characters'],
    },
    
    token: {
        type: String,
    },

    createdAt: {
        type: Date,
        default: Date.now 
    },

})


module.exports = mongoose.model('User',userShema)
