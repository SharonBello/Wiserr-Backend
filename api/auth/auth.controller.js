const authService = require('./auth.service')
const logger = require('../../services/logger.service')
const userService = require('../user/user.service')
const Cryptr = require('cryptr')
const bcrypt = require('bcrypt')
const cryptr = new Cryptr(process.env.SECRET1 || 'Secret-Wiserr-1234')

async function login(req, res) {
    const { userName, password } = req.body

    try {
        const user = await authService.login(userName, password)
        const loginToken = authService.getLoginToken(user)
        logger.info('User login: ', user)
        res.cookie('loginToken', loginToken)
        res.json(user)
    } catch (err) {
        logger.error('Failed to Login ' + err)
        res.status(401).send({ err: 'Failed to Login' })
    }
}

async function signupGoogle(req, res) {
    try {
        const credentials = req.body
        console.log('auth controller line 26')
        let userExisting = await userService.checkIfGoogleAccount(credentials) 
        if(!userExisting) {
            console.log('!userExisting')    
            userService.add(credentials)
        }
        const user = await authService.login(credentials.userName, credentials.password)
        logger.info('User signup:', user)
        const loginToken = authService.getLoginToken(user)
        res.cookie('loginToken', loginToken)
        res.json(user)
    } catch (err) {
        logger.error('Failed to signup ' + err)
        res.status(500).send({ err: 'Failed to signup' })
    }
}

async function signup(req, res) {
    try {
        const credentials = req.body
        // Never log passwords
        // logger.debug(credentials)
        const account = await authService.signup(credentials)
        logger.debug(`auth.route - new account created: ` + JSON.stringify(account))
        const user = await authService.login(credentials.userName, credentials.password)
        logger.info('User signup:', user)
        const loginToken = authService.getLoginToken(user)
        res.cookie('loginToken', loginToken)
        res.json(user)
    } catch (err) {
        logger.error('Failed to signup ' + err)
        res.status(500).send({ err: 'Failed to signup' })
    }
}

async function logout(req, res) {
    try {
        res.clearCookie('loginToken')
        res.send({ msg: 'Logged out successfully' })
    } catch (err) {
        res.status(500).send({ err: 'Failed to logout' })
    }
}

module.exports = {
    login,
    signup,
    logout,
    signupGoogle
}