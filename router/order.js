const express = require('express');
const { createOrder, fetchOrdersByUser, deleteOrder, updateOrder, fetchAllOrders } = require('../controller/order');

const router = express.Router();
//  /orders is already added in base path
router.post('/', createOrder)
      .get('/user/:userid', fetchOrdersByUser)
      .delete('/:id', deleteOrder)
      .patch('/:id', updateOrder)
      .get('/',fetchAllOrders)


exports.router = router;