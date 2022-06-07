const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const reviewService = require('../review/review.service')
const ObjectId = require('mongodb').ObjectId
const userService = require('../user/user.service');

async function query(filterBy) {

    try {

        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('gig')
        let sortBy = filterBy.sortBy
        let sortType = 1
        let gigs = await collection.find(criteria).sort({ [sortBy]: sortType }).toArray()
        return gigs
    } catch (err) {
        logger.error('cannot find gigs', err)
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

    return criteria
}

async function getById(gigId) {

    try {

        const collection = await dbService.getCollection('gig')
        const gig = collection.findOne({ _id: ObjectId(gigId) })

        return gig
    } catch (err) {
        logger.error(`while finding gig ${gigId}`, err)
        throw err
    }
}

async function remove(gigId) {
    try {
        const collection = await dbService.getCollection('gig')
        await collection.deleteOne({ _id: ObjectId(gigId) })
        return gigId
    } catch (err) {
        logger.error(`cannot remove gig ${gigId}`, err)
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
        logger.error('cannot insert gig', err)
        throw err
    }
}

async function addGigReview(gig, review) {
    try {
        let id = ObjectId(gig._id)
        const collection = await dbService.getCollection('gig')
        const updatedGig = await collection.updateOne({ _id: ObjectId(id) }, { $set: { ...gig, review: review } })
        return updatedGig
    } catch (err) {
        logger.error('cannot add review', err)
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
        logger.error(`cannot update gig ${gigId}`, err)
        throw err
    }
}

async function updateGigRating(gig, rating) {
    try {
        let id = ObjectId(gig._id)
        const collection = await dbService.getCollection('gig')
        const updatedGig = await collection.updateOne({ _id: ObjectId(id) }, { $set: { ...gig, rating: rating } })
        return updatedGig
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
    updateGigRating,
    addGigReview
}