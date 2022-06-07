const gigService = require('./gig.service.js');
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')

// GET LIST
async function getGigs(req, res) {

  try {
    var queryParams = req.query;
    const gigs = await gigService.query(queryParams)
    res.send(gigs);
  } catch (err) {
    logger.error('Failed to get gigs', err)
    res.status(500).send({ err: 'Failed to get gigs' })
  }
}

// GET BY ID 
async function getGigById(req, res) {

  try {
    const gigId = req.params.id;
    const gig = await gigService.getById(gigId)
    res.json(gig)
  } catch (err) {
    logger.error('Failed to get gig', err)
    res.status(500).send({ err: 'Failed to get gig' })
  }
}

// POST (add gig)
async function addGig(req, res) {
  try {
    const gig = req.body;
    //add review random
    if (!gig.reviewsQty) gig.reviewsQty = utilService.getRandomInt(50, 1200)
    const addedGig = await gigService.add(gig)
    res.json(addedGig)
  } catch (err) {
    logger.error('Failed to add gig', err)
    res.status(500).send({ err: 'Failed to add gig' })
  }
}

// POST (add review)
async function addReview(req, res) {

  try {
    const gig = req.body;
    const review = req.body;
    const addedReview = await gigService.addUserReview(gig, review)
    res.json(addedReview)
  } catch (err) {
    logger.error('Failed to add review', err)
    res.status(500).send({ err: 'Failed to add review' })
  }
}

// PUT (Update gig)
async function updateGig(req, res) {

  try {
    const gig = req.body;
    if (!gig.reviewsQty) gig.reviewsQty = getRandomInt(50, 1200)
    const updatedGig = await gigService.update(gig)
    res.json(updatedGig)
  } catch (err) {
    logger.error('Failed to update gig', err)
    res.status(500).send({ err: 'Failed to update gig' })
  }
}

async function updateGigRate(req, res) {

  try {
    const gig = req.body;
    const rating = req.body;
    const updatedRate = await gigService.updateUserRating(gig, rating)
    res.json(updatedRate)
  } catch (err) {
    logger.error('Failed to update gig', err)
    res.status(500).send({ err: 'Failed to update gig' })
  }
}

// DELETE (Remove gig)
async function removeGig(req, res) {

  try {
    const gigId = req.params.id;
    const removedId = await gigService.remove(gigId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove gig', err)
    res.status(500).send({ err: 'Failed to remove gig' })
  }
}

module.exports = {
  getGigs,
  getGigById,
  addGig,
  addReview,
  updateGig,
  updateGigRate,
  removeGig
}
