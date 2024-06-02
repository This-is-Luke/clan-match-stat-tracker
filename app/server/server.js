const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');
const rateLimiter = require('./middleware/rateLimiter');

// Load environment variables from .env file
dotenv.config();

// Initialize the Express application
const app = express();

// Connect Database
connectDB();

// Middleware to parse JSON requests
app.use(express.json({ extended: false }));

// Middleware for logging requests
app.use(logger);

// Middleware for rate limiting
app.use(rateLimiter);

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/manager', require('./routes/manager'));
app.use('/api/user', require('./routes/user'));

// Error Handling Middleware
app.use(errorHandler);

// Port Configuration
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
