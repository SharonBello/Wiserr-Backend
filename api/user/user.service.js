
const ObjectId = require('mongodb').ObjectId
const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')


module.exports = {
    query,
    getById,
    getByUsername,
    add,
    updateUserIsSeller,
    getByGoogleId,
    checkIfGoogleAccount,
}

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('user')
        let users = await collection.find(criteria).toArray()
        users = users.map(user => {
            delete user.password
            user.createdAt = ObjectId(user._id).getTimestamp()
            return user
        })
        return users
    } catch (err) {
        logger.error('Cannot find users', err)
        throw err
    }
}

async function getByGoogleId(googleId) {
    try {
        const collection = await dbService.getCollection("user");
        const user = await collection.findOne({ googleId: googleId });
        delete user.password;
        user.createdAt = ObjectId(user._id).getTimestamp();
        return user;
    } catch (err) {
        logger.error(`while finding user ${userId}`, err);
        throw err;
    }
}

async function getById(userId) {
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ _id: ObjectId(userId) })
        delete user.password
        return user
    } catch (err) {
        logger.error(`Cannot find user by id - ${userId}`, err)
        throw err
    }
}
async function getByUsername(userName) {

    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ userName })
        return user
    } catch (err) {
        logger.error(`Cannot find user by name -  ${userName}`, err)
        throw err
    }
}


async function add(user) {
    console.log('user service line 71', user)
    try {
        const userToAdd = {
            userName: user.userName,
            password: user.password,
            fullName: user.fullname,
            imgUrl: user.imgUrl,
            level: 'Level 1 Seller',
            email: user.userName + '@gmail.com',
            avgOrdersRate: 0,
            isSeller: false,
            reviews: [],
            google_account: '',
            facebook_account: '',
            twitter_account: ''
        }

        const collection = await dbService.getCollection('user')

        await collection.insertOne(userToAdd)

        return userToAdd
    } catch (err) {
        logger.error('Cannot add user', err)
        throw err
    }
}

async function checkIfGoogleAccount(userDeatils) {
    const collection = await dbService.getCollection('user')
    try {
        const user = await collection.findOne({
            userName: userDeatils.userName,
            password: userDeatils.password,
            imgUrl: userDeatils.imgUrl
        });
        return user
    } catch {
        return 0
    }
}

async function updateUserIsSeller(userId) {
    const userToSave = await getById(userId)
    userToSave.isSeller = true
    const collection = await dbService.getCollection('user')
    await collection.updateOne({ _id: ObjectId(userId) }, { $set: userToSave })

    return userToSave
}


function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.txt) {
        const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
        criteria.$or = [
            {
                userName: txtCriteria
            },
            {
                fullName: txtCriteria
            }
        ]
    }
    return criteria
}




