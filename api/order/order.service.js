const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
// const reviewService = require('../review/review.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy) {

    try {
        const criteria = _buildCriteria(filterBy)

        const collection = await dbService.getCollection('order')
        let orders = await collection.find(criteria).toArray()
        return orders
    } catch (err) {
        logger.error('cannot find orders', err)
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
        logger.error(`while finding order ${orderId}`, err)
        throw err
    }
}

async function remove(orderId) {
    try {
        const collection = await dbService.getCollection('order')
        await collection.deleteOne({ _id: ObjectId(orderId) })
        return orderId
    } catch (err) {
        logger.error(`cannot remove order ${orderId}`, err)
        throw err
    }
}

async function add(order) {

    try {
        const collection = await dbService.getCollection('order')
        await collection.insertOne(order)
        return order
    } catch (err) {
        logger.error('cannot insert order', err)
        throw err
    }
}

async function addOrderReview(order, review) {
    try {
        let id = ObjectId(order._id)
        const collection = await dbService.getCollection('order')
        const updatedOrder = await collection.updateOne({ _id: id }, { $set: { ...order, review: review } })
        return updatedOrder
    } catch (err) {
        logger.error('cannot add review', err)
        throw err
    }
}

async function update(order) {

    try {
        let id = ObjectId(order._id)
        delete order._id
        const collection = await dbService.getCollection('order')
        await collection.updateOne({ _id: ObjectId(id) }, { $set: { ...order } })
        return order
    } catch (err) {
        logger.error(`cannot update order ${order._Id}`, err)
        throw err
    }
}

async function updateOrderRating(order, rating) {

    try {
        let id = ObjectId(order._id)
        const collection = await dbService.getCollection('order')
        const updatedOrder = await collection.updateOne({ _id: ObjectId(id) }, { $set: { ...order, rating: rating } })
        return updatedOrder
    } catch (err) {
        logger.error('cannot add review', err)
        throw err
    }
}

module.exports = {
    remove,
    query,
    getById,
    add,
    update,
    updateOrderRating,
    addOrderReview
}