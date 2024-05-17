
const express = require("express")
const { updatePassword, deleteUser } = require("../controllers/users.controller")
const comparePassword = require('../Middlewares/comparePassword')

const router = express.Router()
router.patch('/api/user/edit/password', comparePassword,  updatePassword )
router.delete('/api/user',  deleteUser )

module.exports = router