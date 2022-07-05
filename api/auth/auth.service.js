const Cryptr = require('cryptr')
const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')

const cryptr = new Cryptr(process.env.SECRET1 || 'Secret-Wiserr-1234')

async function login(userName, password) {
    try {
        logger.debug(`auth.service - login with username: ${userName}`)
        const user = await userService.getByUsername(userName)

        if (!user) return Promise.reject('Invalid username or password')

        //we are treating 2 different way of saveing password
        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            if (password !== user.password) return Promise.reject('Invalid username or password')
        }
        delete user.password
        user._id = user._id.toString()
        return user
    } catch (err) {
        logger.error('cannot login', err)
        throw err
    }
}

async function signup({ userName, password, fullname, imgUrl }) {
    try {

        const saltRounds = 10
        logger.debug(`auth.service - signup with username: ${userName}, fullname: ${fullname}`)
        if (!userName || !password || !fullname) return Promise.reject('Missing required signup information')

        const userExist = await userService.getByUsername(userName)
        if (userExist) return Promise.reject('Username already taken')

        const hash = await bcrypt.hash(password, saltRounds)
        return userService.add({ userName, password: hash, fullname, imgUrl })
    } catch (err) {
        logger.error('Cannot signup', err)
        throw err
    }
}


function getLoginToken(user) {
    return cryptr.encrypt(JSON.stringify(user))
}

function validateToken(loginToken) {
    try {
        const json = cryptr.decrypt(loginToken)
        const loggedinUser = JSON.parse(json)
        return loggedinUser

    } catch (err) {
        console.log('Invalid login token')
    }
    return null
}


module.exports = {
    signup,
    login,
    getLoginToken,
    validateToken
}