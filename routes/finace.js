const express = require("express")
const finaceShema = require('../models/finace')


const router = express.Router()

router.get('/finaces', async (req, res) =>{
    try {
        const result =  await finaceShema.findOne({}).populate('expenses') 
         res.status(200).json(result)
     
        } catch (error) {
         console.log(error)
        }
})



module.exports = router