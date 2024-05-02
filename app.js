const express = require('express')
const connectDB = require('./configs/dbConn')
const app = express()

require('dotenv').config()

const PORT = process.env.PORT || 3000

// connnet db
connectDB()


// routes
app.use('/', require('./routes/budget'))
app.use('/', require('./routes/finace'))
app.use('/', require('./routes/expense'))
app.use('/', require('./routes/incomes'))



app.listen(PORT, () =>{
    console.log(`server run in port ${PORT}`)
})