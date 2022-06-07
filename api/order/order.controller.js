const orderService = require('./order.service.js');
const logger = require('../../services/logger.service')

// GET LIST
async function getOrders(req, res) {
  try {
    logger.debug('Trying tog et orders')
    var queryParams = req.query;
    const orders = await orderService.query(queryParams)
    res.json(orders);
  } catch (err) {
    logger.error('Failed to get orders', err)
    res.status(500).send({ err: 'Failed to get orders' })
  }
}

// GET BY ID 
async function getOrderById(req, res) {
  try {
    const orderId = req.params.id;
    const order = await orderService.getById(orderId)
    res.json(order)
  } catch (err) {
    logger.error('Failed to get order', err)
    res.status(500).send({ err: 'Failed to get order' })
  }
}

// POST (add order)
async function addOrder(req, res) {
  try {
    const order = req.body;
    const addedOrder = await orderService.add(order)
    logger.info('from order.controller - addOrder(req, res)', addedOrder)
    res.json(addedOrder)
  } catch (err) {
    logger.error('Failed to add order', err)
    res.status(500).send({ err: 'Failed to add order' })
  }
}

// POST (add review)
async function addReview(req, res) {
  try {
    const order = req.body;
    const review = req.body;
    const addedReview = await orderService.addUserReview(order, review)
    res.json(addedReview)
  } catch (err) {
    logger.error('Failed to add review', err)
    res.status(500).send({ err: 'Failed to add review' })
  }
}

// PUT (Update order)
async function updateOrder(req, res) {
  try {
    const order = req.body;
    const updatedOrder = await orderService.update(order)
    res.json(updatedOrder)
  } catch (err) {
    logger.error('Failed to update order', err)
    res.status(500).send({ err: 'Failed to update order' })
  }
}

async function updateOrderRate(req, res) {
  try {
    const order = req.body;
    const rating = req.body;

    const updatedRate = await orderService.updateUserRating(order, rating)

    res.json(updatedRate)
  } catch (err) {
    logger.error('Failed to update order', err)
    res.status(500).send({ err: 'Failed to update order' })
  }
}

// DELETE (Remove order)
async function removeOrder(req, res) {

  try {
    const orderId = req.params.id;
    const removedId = await orderService.remove(orderId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove order', err)
    res.status(500).send({ err: 'Failed to remove order' })
  }
}

module.exports = {
  getOrders,
  getOrderById,
  addOrder,
  addReview,
  updateOrder,
  updateOrderRate,
  removeOrder
}
