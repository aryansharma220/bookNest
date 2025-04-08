const Order = require("./order.model");

const createAOrder = async (req, res) => {
  try {
    const orderData = req.body;
    const newOrder = new Order(orderData);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error creating order", error);
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
};

const getOrderByEmail = async (req, res) => {
  try {
    const {email} = req.params;
    const orders = await Order.find({email}).sort({createdAt: -1});
    if(!orders) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders", error);
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    if (order.status === 'cancelled') {
      return res.status(400).json({ message: "Order is already cancelled" });
    }
    
    if (order.status === 'completed') {
      return res.status(400).json({ message: "Cannot cancel a completed order" });
    }
    
    order.status = 'cancelled';
    await order.save();
    
    res.status(200).json({ message: "Order cancelled successfully", order });
  } catch (error) {
    console.error("Error cancelling order", error);
    res.status(500).json({ message: "Failed to cancel order" });
  }
};

module.exports = {
  createAOrder,
  getOrderByEmail,
  cancelOrder
};
