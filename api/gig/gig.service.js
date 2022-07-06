const ObjectId = require('mongodb').ObjectId
const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
// const reviewService = require('../review/review.service')
const userService = require('../user/user.service');
const orderService = require('../order/order.service')

async function query(filterBy) {

    try {

        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('gig')
        let sortBy = filterBy.sortBy
        let sortType = 1
        let gigs = await collection.find(criteria).sort({ [sortBy]: sortType }).toArray()
        //If there is a user, it mean that we are asking for his gigs only
        if (filterBy.userId) {
            const orders = await orderService.query()
            getOrderQty(gigs, orders)
        }
        return gigs
    } catch (err) {
        logger.error('Cannot find gigs', err)
        throw err
    }
}

function _buildCriteria(filterBy) {

    let criteria = {}

    if (filterBy.txt) {
        const txtCriteria = { $regex: filterBy.txt, $options: 'i' } //'i' for Capitals       
        criteria.$or = [
            {
                title: txtCriteria
            },
            {
                description: txtCriteria
            }
        ]
    }
    if (filterBy.priceMin && filterBy.priceMax < Infinity) {
        criteria.price = ({ $gte: +filterBy.priceMin, $lte: +filterBy.priceMax })
    }

    if (filterBy.category) {
        txtCriteria = { $regex: filterBy.category, $options: 'i' }
        criteria.category = txtCriteria
    }
    if (filterBy.deliveryDate >= 1) {
        criteria.daysToMake = { $lte: +filterBy.deliveryDate }
    }
    if (filterBy.userId) {
        criteria['owner._id'] = { $regex: filterBy.userId }
    }
    return criteria
}

async function getOrderQty(gigs, orders) {

    try {
        if (gigs.length ) {
            
            gigs.forEach(gig => {
                gig.orderQty = 0
                gig.orderQty = orders.reduce((acc, order) => acc + ((gig._id == order.gig._id) ? +1 : 0),0)
                return gig
            })               
            return gigs
        }
    } catch (err) {
        logger.error(`While counting gigs by seller id and gig id `, err)
        throw err
    }
}



async function getById(gigId) {

    try {

        const collection = await dbService.getCollection('gig')
        const gig = collection.findOne({ _id: ObjectId(gigId) })
        return gig
    } catch (err) {
        logger.error(`While finding gig ${gigId}`, err)
        throw err
    }
}

async function remove(gigId) {
    try {
        const collection = await dbService.getCollection('gig')
        await collection.deleteOne({ _id: ObjectId(gigId) })
        return gigId
    } catch (err) {
        logger.error(`Cannot remove gig ${gigId}`, err)
        throw err
    }
}

async function add(gig) {

    try {
        const collection = await dbService.getCollection('gig')
        await collection.insertOne(gig)
        const user = await userService.updateUserIsSeller(gig.owner._id)
        return gig
    } catch (err) {
        logger.error('Cannot insert gig', err)
        throw err
    }
}


async function update(gig) {
    try {
        let id = ObjectId(gig._id)
        delete gig._id
        const collection = await dbService.getCollection('gig')
        await collection.updateOne({ _id: ObjectId(id) }, { $set: { ...gig } })

        return gig
    } catch (err) {
        logger.error(`Cannot update gig ${gigId}`, err)
        throw err
    }
}

// async function updateGigRating(gig, rating) {
//     try {
//         let id = ObjectId(gig._id)
//         const collection = await dbService.getCollection('gig')
//         const updatedGig = await collection.updateOne({ _id: ObjectId(id) }, { $set: { ...gig, rating: rating } })
//         return updatedGig
//     } catch (err) {
//         logger.error('Cannot updare gig rating', err)
//         throw err
//     }
// }

module.exports = {
    remove,
    query,
    getById,
    add,
    update,
    // updateGigRating,    
    getOrderQty
}