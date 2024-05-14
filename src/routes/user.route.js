
const express = require("express")
const { updatePassword } = require("../controllers/users.controller")


const router = express.Router()
router.patch('/api/user/update/password',  updatePassword )


module.exports = router