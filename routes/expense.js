const express = require("express")
const expenseShema = require('../models/expense')


const router = express.Router()

router.get('/expenses', async (req, res) =>{
    try {
       const result =  await expenseShema.find({})
        res.status(200).json(result)
    
       } catch (error) {
        console.log(error)
       }
})

router.post('/expense', async (req, res) =>{
    const {title, montant} = req.body
    if(!title || !montant) res.status(400)
   try {
    await expenseShema.create({title, montant})
    res.status(201).json('expense created')

   } catch (error) {
    console.log(error)
   }
    
})

router.put('/expenses', (req, res) =>{
    res.send('put expenses')
})

router.delete('/expenses', (req, res) =>{
    res.send('delete expenses')
})

module.exports = router