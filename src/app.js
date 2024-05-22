const express = require('express')
const connectDB = require('../configs/dbConn')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const bodyParser = require('body-parser')
const verifyToken = require('./Middlewares/verifyToken')
const log = require('./Middlewares/log')

const app = express()
require('dotenv').config()

const port = process.env.PORT || 3001;

// middlewares 
app.use(cors())
app.use(bodyParser.json())
app.use(cookieParser())
app.use(log)

// routes

app.get('/', (req, res) => {
    res.json({
        "message": "Bienvenue à l'API de Gestion de Budget",
        "version": "1.0.0",
        "documentation_url": "https://github.com/KaneDev7/gestion_budget_API?tab=readme-ov-file"
    })
})

app.use('/', require('./routes/auth.route'))
app.use(verifyToken)
app.use('/', require('./routes/token.route'))
app.use('/', require('./routes/user.route'))
app.use('/', require('./routes/budget.route'))
app.use('/', require('./routes/finance.route'))
app.use('/', require('./routes/expense.route'))
app.use('/', require('./routes/incomes.route'))


// not found route
app.use((req, res) => { res.status(404).json({ message: 'Not found' }); });


// comment the code below if you wante to test the API . becaifull to d'ont comment <<  module.exports = app >>

connectDB()
app.listen(port, () => {
    console.log(`server run in port ${port}`)
})

module.exports = app  // don't comment this
