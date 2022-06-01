const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const reviewService = require('../review/review.service')
const ObjectId = require('mongodb').ObjectId


async function query(filterBy) {
    // console.log('filterBy in gig service query', filterBy)
    try {
        // console.log('filterBy', filterBy)
        const criteria = _buildCriteria(filterBy)
        // const criteria = {}
        // console.log('criteria in gig service row 12', criteria)
        const collection = await dbService.getCollection('gig')
        // console.log('gig.service - line 14 - collection', collection)

        let sortBy = filterBy.sortBy 
        let sortType = 1
        // if(sortBy === 'title') {
        //     sortBy = 'createdAt'
        //     sortType = -1
        // }
        // let gigs = await collection.toArray()
        // let gigs = await collection.find(criteria).toArray()
        // console.log('sortBy row 24 gig service',sortBy )
        let gigs = await collection.find(criteria).sort({[sortBy]:sortType}).toArray()
        // console.log('gigs', gigs)
        return gigs
    } catch (err) {
        logger.error('cannot find gigs', err)
        throw err
    }
}


function _buildCriteria(filterBy) {
    let criteria = {}
    if (filterBy.txt) {
        const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
        criteria.$or = [
            {
                name: txtCriteria
            }
        ]
    }
    if(filterBy.category){
        txtCriteria = { $regex: filterBy.category, $options: 'i' }
        criteria.category = txtCriteria
    }
    // if (filterBy.labelslength) {
    //     const labels = filterBy.labels.split(',')
    //     criteria.labels = {$all: labels}
    // }

    // if (filterBy.inStock) {
    //     criteria.inStock =  JSON.parse(filterBy.inStock)
    // }

    // const PAGE_SIZE = 3
    // if (filterBy.pageIdx !== undefined) {
    //     const startIdx = +filterBy.pageIdx * PAGE_SIZE
    //     // if (startIdx > gigs.length - 1) return Promise.reject()
    //     gigs = gigs.slice(startIdx, startIdx + PAGE_SIZE)
    // }

    // console.log('criteria', criteria, 'sortBy',filterBy.sortBy)

    return criteria
}

async function getById(gigId) {
    // console.log('get by id in gig service' )
    try {
        // console.log('gigId in gig service row 66',gigId )
        const collection = await dbService.getCollection('gig')
        const gig = collection.findOne({ _id: ObjectId(gigId) })
        // console.log('gig in gig service row 69', gig)
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
    // TODO - add gig. description with make lorem
    try {
        const collection = await dbService.getCollection('gig')
        // const addedGig = await collection.insertOne(gig)
        await collection.insertOne(gig)

        // addedGig = addedGig.ops.pop()
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
        // console.log('gig.service - 134 gig', gig)
        // console.log('gig.service - 135 updatedGig', updatedGig)
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