const express = require('express');
const { createAOrder, getOrderByEmail, cancelOrder } = require('./order.controller');

const router =  express.Router();

router.post("/", createAOrder);
router.get("/email/:email", getOrderByEmail);
router.patch("/:orderId/cancel", cancelOrder);

module.exports = router;