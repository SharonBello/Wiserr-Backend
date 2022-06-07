const express = require('express')
// const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getGigs, getGigById, addGig, updateGig, removeGig, addReview, updateGigRate } = require('./gig.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getGigs)
router.get('/:id', getGigById)
router.post('/', addGig)
// router.post('/', requireAuth, requireAdmin, addGig)
router.post('/:id', addReview)
router.put('/:id', updateGig)
router.put('/', updateGigRate)
// router.delete('/:id', removeGig)

module.exports = router