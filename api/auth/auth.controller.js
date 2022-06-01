const authService = require('./auth.service')
const logger = require('../../services/logger.service')

async function login(req, res) {
    const { userName, password } = req.body
    // console.log('username in auto controller', userName, 'password=',password)
    try {
        const user = await authService.login(userName, password)
        // console.log('user in auth controller', user)
        const loginToken = authService.getLoginToken(user)
        logger.info('User login: ', user)
        res.cookie('loginToken', loginToken)
        res.json(user)
    } catch (err) {
        logger.error('Failed to Login ' + err)
        res.status(401).send({ err: 'Failed to Login' })
    }
}

async function signup(req, res) {
    try {
        const credentials = req.body
        // console.log('credentials ===========================',credentials )
        // Never log passwords
        // logger.debug(credentials)
        const account = await authService.signup(credentials)
        // console.log('account in row 27 auth controller', account)
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

async function logout(req, res){
    // console.log('im here from logout function')

    try {
    
        res.clearCookie('loginToken')
    // console.log('after cleaning...')
        res.send({ msg: 'Logged out successfully' })
    } catch (err) {
        // console.log('errrporrr')
        res.status(500).send({ err: 'Failed to logout' })
    }
}

module.exports = {
    login,
    signup,
    logout
}