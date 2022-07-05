
const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId


module.exports = {
    query,
    getById,
    getByUsername,
    remove,
    update,
    add,
    updateUserIsSeller
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
        logger.error('cannot find users', err)
        throw err
    }
}

async function getById(userId) {
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ _id: ObjectId(userId) })

        delete user.password

        return user
    } catch (err) {
        logger.error(`while finding user ${userId}`, err)
        throw err
    }
}
async function getByUsername(userName) {

    try {

        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ userName })

        return user
    } catch (err) {
        logger.error(`while finding user ${userName}`, err)
        throw err
    }
}

async function remove(userId) {
    try {
        const collection = await dbService.getCollection('user')
        await collection.deleteOne({ '_id': ObjectId(userId) })
    } catch (err) {
        logger.error(`cannot remove user ${userId}`, err)
        throw err
    }
}

async function update(user) {
    try {
        const userToSave = {
            _id: ObjectId(user._id),
            fullName: user.fullname,
            isSeller: user.isSeller,
            avgOrdersRate: user.avgOrdersRate,
        }
        const collection = await dbService.getCollection('user')
        await collection.updateOne({ _id: userToSave._id }, { $set: userToSave })
        return userToSave
    } catch (err) {
        logger.error(`cannot update user ${user._id}`, err)
        throw err
    }
}

async function add(user) {

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
        logger.error('cannot insert user', err)
        throw err
    }
}

async function updateUserIsSeller(userId){    
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




