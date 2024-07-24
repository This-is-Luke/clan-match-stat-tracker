const express = require('express');
const dotenv = require('dotenv');
const { db } = require('./src/firebase'); // Import Firestore configuration
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');
const rateLimiter = require('./middleware/rateLimiter');

dotenv.config();

const app = express();

// Middleware
app.use(express.json({ extended: false }));
app.use(logger);
app.use(rateLimiter);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/manager', require('./routes/manager'));
app.use('/api/user', require('./routes/user'));
app.use('/api/protected', require('./routes/protectedRoute'));

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app;
