const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
// contact route
const contactRoutes = require('./routes/contact');
app.use('/api/contact', contactRoutes);
// content (products/categories/collections)
const contentRoutes = require('./routes/content');
app.use('/api', contentRoutes);
const ordersRoutes = require('./routes/orders');
app.use('/api', ordersRoutes);

// basic health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// start server after optional DB connect
async function start() {
	const mongo = process.env.MONGO_URI;
	try {
		if (mongo) {
			await mongoose.connect(mongo, { useNewUrlParser: true, useUnifiedTopology: true });
			console.log('Connected to MongoDB');
		} else {
			console.log('MONGO_URI not set — skipping MongoDB connection (server will still run)');
		}

		app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
	} catch (err) {
		console.error('Failed to start server', err);
		process.exit(1);
	}
}

start();

// Fallback for unmatched routes (return JSON instead of HTML)
app.use((req, res) => {
	if (req.path.startsWith('/api')) {
		return res.status(404).json({ message: 'API route not found' });
	}
	// For non-API paths, let frontend dev server handle SPA routes
	res.status(404).send('Not found');
});

// Global error handler to ensure JSON responses for errors
app.use((err, req, res, next) => {
	console.error('Unhandled error:', err);
	const status = err.status || 500;
	// send JSON for API routes
	if (req.path.startsWith('/api')) {
		return res.status(status).json({ message: err.message || 'Server error' });
	}
	res.status(status).send(err.message || 'Server error');
});

