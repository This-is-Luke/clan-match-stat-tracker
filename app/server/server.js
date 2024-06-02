const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');
const rateLimiter = require('./middleware/rateLimiter');
const emailService = require('./services/emailService');
const { generateRandomString } = require('./utils/helperFunctions');

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));
app.use(logger);
app.use(rateLimiter);

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/manager', require('./routes/manager'));
app.use('/api/user', require('./routes/user'));

// Error Handling Middleware
app.use(errorHandler);

// Example of using email service and utils
app.post('/send-email', (req, res) => {
    const { to, subject, text } = req.body;
    emailService(to, subject, text);
    res.send('Email sent');
});

app.get('/generate-string', (req, res) => {
    const randomString = generateRandomString(10);
    res.send(randomString);
});

// Port Configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
