const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// ✅ 1. CORS FIRST
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ 2. BODY PARSER (must come BEFORE any routes)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ 3. ROUTES
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const cartRoutes = require('./routes/cart');
app.use('/api/cart', cartRoutes);

const contactRoutes = require('./routes/contact');
app.use('/api/contact', contactRoutes);

const contentRoutes = require('./routes/content');
app.use('/api', contentRoutes);

const ordersRoutes = require('./routes/orders');
app.use('/api', ordersRoutes);

// NEW: User orders route
const userOrdersRoutes = require('./routes/userOrders');
app.use('/api/user', userOrdersRoutes);

// Optional: Payment routes if you have them
// const paymentRoutes = require('./routes/payment');
// app.use('/api/payment', paymentRoutes);

// basic health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// start server after optional DB connect
async function start() {
  const mongo = process.env.MONGO_URI;
  try {
    if (mongo) {
      await mongoose.connect(mongo, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('✅ Connected to MongoDB');
    } else {
      console.log('⚠️  MONGO_URI not set — skipping MongoDB connection (server will still run)');
    }

    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error('❌ Failed to start server', err);
    process.exit(1);
  }
}

start();

// Fallback for unmatched routes
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API route not found' });
  }
  res.status(404).send('Not found');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  const status = err.status || 500;
  if (req.path.startsWith('/api')) {
    return res.status(status).json({ message: err.message || 'Server error' });
  }
  res.status(status).send(err.message || 'Server error');
});