const { Schema, default: mongoose} = require('mongoose')


const userShema = new Schema({
    username: {
        type: String,
        require : true,
        unique : true,
        lowercase : true,
    },

    password: {
        type: String,
        require: true,
        minLength : [3, 'Le mot de passe doit avoir au minimum trois caractères'],
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
