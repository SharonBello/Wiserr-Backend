const express = require('express')
const { login, signup, logout, signupGoogle } = require('./auth.controller')

const router = express.Router()

router.post('/login', login)
router.post('/signup', signup)
router.post('/logout', logout)
router.post('/google', signupGoogle)
module.exports = router