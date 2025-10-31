const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const { authMiddleware } = require('../middleware/admin');
const User = require('../models/User');

// GET /api/user/orders - Get all orders for logged-in user
router.get('/orders', authMiddleware, async (req, res) => {
  try {
    console.log('User orders requested by user ID:', req.user.id);
    
    // Get user from token
    const user = await User.findById(req.user.id);
    
    if (!user) {
      console.log('User not found:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Fetching orders for email:', user.email);

    // Find all orders for this user's email
    const orders = await Order.find({ customer_email: user.email })
      .sort({ createdAt: -1 }); // Most recent first

    console.log(`Found ${orders.length} orders for user`);

    res.json(orders);
  } catch (err) {
    console.error('Fetch user orders error:', err);
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
});

// GET /api/user/orders/:id - Get specific order details for logged-in user
router.get('/orders/:id', authMiddleware, async (req, res) => {
  try {
    console.log('Order details requested for order:', req.params.id);
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find order and verify it belongs to this user
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      console.log('Order not found:', req.params.id);
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify order belongs to user
    if (order.customer_email !== user.email) {
      console.log('Access denied - order does not belong to user');
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get order items
    const items = await OrderItem.find({ order_id: order._id });

    console.log(`Found ${items.length} items for order`);

    res.json({ order, items });
  } catch (err) {
    console.error('Fetch order details error:', err);
    res.status(500).json({ message: 'Failed to fetch order details', error: err.message });
  }
});

// GET /api/user/orders/stats/summary - Get order statistics for user
router.get('/orders/stats/summary', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const orders = await Order.find({ customer_email: user.email });

    const stats = {
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      processingOrders: orders.filter(o => o.status === 'processing').length,
      shippedOrders: orders.filter(o => o.status === 'shipped').length,
      deliveredOrders: orders.filter(o => o.status === 'delivered').length,
      cancelledOrders: orders.filter(o => o.status === 'cancelled').length,
      totalSpent: orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.total_amount, 0)
    };

    res.json(stats);
  } catch (err) {
    console.error('Fetch order stats error:', err);
    res.status(500).json({ message: 'Failed to fetch order statistics', error: err.message });
  }
});

module.exports = router;