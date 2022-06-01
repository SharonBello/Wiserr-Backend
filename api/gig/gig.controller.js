const gigService = require('./gig.service.js');
const logger = require('../../services/logger.service')

// GET LIST
async function getGigs(req, res) {
  try {
    // logger.debug('Trying to get gigs row 7')
    var queryParams = req.query;
    // console.log('queryParams',queryParams )
    const gigs = await gigService.query(queryParams)
    // logger.debug('gig.controller 11 gigs', gigs)
    res.send(gigs);
  } catch (err) {
    logger.error('Failed to get gigs', err)
    res.status(500).send({ err: 'Failed to get gigs' })
  }
}

// GET BY ID 
async function getGigById(req, res) {
  // console.log('in get by id in gig controller')
  try {
    const gigId = req.params.id;
    // console.log('gigId in gig controller line 23', gigId)
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
    // logger.info('from gig.controller - addGig(req, res)', gig)
    const addedGig = await gigService.add(gig)
    // logger.info('from gig.controller - addGig(req, res)', addedGig)
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
  // console.log('in updategig in gig controller')
  // console.log('update gig in gig controller row 62', req.body)
  try {
    const gig = req.body;
    const updatedGig = await gigService.update(gig)
    // console.log('updatedGig in gig controller row 66', updatedGig)
    res.json(updatedGig)
  } catch (err) {
    // console.log('update gig in gig controller row 69', req)
    logger.error('Failed to update gig', err)
    res.status(500).send({ err: 'Failed to update gig' })
  }
}

async function updateGigRate(req, res) {
  try {
    const gig = req.body;
    const rating = req.body;
    // console.log('gig.controller 75 - gig',gig )
    // console.log('gig.controller 75 - rating', rating ) 
    // const updatedRate = await gigService.updateUserRating(gig, rating)
    // console.log('gig.controller 75 - updatedRate', updatedRate)
    // res.json(updatedRate)
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
