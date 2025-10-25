const express = require('express');
const router = express.Router();

const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');

// POST /api/orders - create order and items
router.post('/orders', async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      city,
      postalCode,
      country,
      totalAmount,
      items,
    } = req.body;

    if (!customerName || !customerEmail || !shippingAddress || !Array.isArray(items)) {
      return res.status(400).json({ message: 'Missing order data' });
    }

    const order = new Order({
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      shipping_address: shippingAddress,
      city,
      postal_code: postalCode,
      country,
      total_amount: totalAmount,
      status: 'pending',
    });

    await order.save();

    const itemsToSave = items.map((it) => ({
      order_id: order._id,
      product_id: it.product_id,
      product_name: it.product_name,
      product_price: it.product_price,
      quantity: it.quantity,
      subtotal: it.subtotal,
    }));

    await OrderItem.insertMany(itemsToSave);

    res.status(201).json({ id: order._id });
  } catch (err) {
    console.error('Failed to create order', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/orders/:id - get order and items
router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const items = await OrderItem.find({ order_id: order._id });

    res.json({ order, items });
  } catch (err) {
    console.error('Failed to fetch order', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
