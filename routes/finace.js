const express = require("express")


const router = express.Router()

router.get('/finaces', (req, res) =>{
    res.send('get finace')
})



module.exports = router