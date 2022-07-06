const express = require('express')
const { log } = require('../../middlewares/logger.middleware')
const { getOrders, getOrderById, addOrder, removeOrder } = require('./order.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getOrders)
router.get('/:id', getOrderById)
router.post('/', addOrder)
router.delete('/:id', removeOrder)
// router.delete('/:id',requireAdmin, requireAuth, removeOrder)

module.exports = router