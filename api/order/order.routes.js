const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getOrders, getOrderById, addOrder, updateOrder, removeOrder, addReview, updateOrderRate } = require('./order.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getOrders)
router.get('/:id', getOrderById)
router.post('/',  addOrder)
router.post('/:id', addReview)
router.put('/', updateOrderRate)
router.put('/:id',  updateOrder)
router.delete('/:id', removeOrder)
// router.delete('/:id',requireAdmin, requireAuth, removeOrder)

module.exports = router