const userService = require('./user.service')
const logger = require('../../services/logger.service')

async function getUser(req, res) {
    try {
        const user = await userService.getById(req.params.id)
        res.send(user)
    } catch (err) {
        logger.error('Failed to get user', err)
        res.status(500).send({ err: 'Failed to get user' })
    }
}

async function getGoogleUser(req, res) {
    try {
        const user = await userService.getByGoogleId(req.params.id);
        if (user) req.session.user = user;
        res.send(user);
    } catch (err) {
        logger.error("Failed to get google user", err);
        res.status(500).send({ err: "Failed to get google user" });
    }
}

async function getUsers(req, res) {
    try {
        const filterBy = {
            txt: req.query?.txt || '',
            minBalance: +req.query?.minBalance || 0
        }
        const users = await userService.query(filterBy)
        res.send(users)
    } catch (err) {
        logger.error('Failed to get users', err)
        res.status(500).send({ err: 'Failed to get users' })
    }
}


module.exports = {
    getUser,
    getUsers,
    getGoogleUser,
}