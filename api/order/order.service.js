const ObjectId = require('mongodb').ObjectId
const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')

async function query(filterBy) {

    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('order')
        let orders = await collection.find(criteria).toArray()
        return orders
    } catch (err) {
        logger.error('Cannot find orders', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    let criteria = {}
    // if (filterBy.txt) {
    //     const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
    //     criteria.$or = [
    //         {
    //             name: txtCriteria
    //         }
    //     ]
    // }
    // if (filterBy.labels.length) {
    //     const labels = filterBy.labels.split(',')
    //     criteria.labels = {$all: labels}
    // }

    // if (filterBy.inStock) {
    //     criteria.inStock =  JSON.parse(filterBy.inStock)
    // }


    return criteria
}

async function getById(orderId) {
    try {
        const collection = await dbService.getCollection('order')
        const order = collection.findOne({ _id: ObjectId(orderId) })
        return order
    } catch (err) {
        logger.error(`Cannot finding order by id -  ${orderId}`, err)
        throw err
    }
}

async function add(order) {

    try {
        // console.log('order in order service ',order )
        const collection = await dbService.getCollection('order')
        await collection.insertOne(order)
        return order
    } catch (err) {
        logger.error('Cannot insert order', err)
        throw err
    }
}

async function remove(orderId) {
    try {
        const collection = await dbService.getCollection('order')
        await collection.deleteOne({ _id: ObjectId(orderId) })
        return orderId
    } catch (err) {
        logger.error(`Cannot remove order -  ${orderId}`, err)
        throw err
    }
}


module.exports = {
    remove,
    query,
    getById,
    add,
  
}