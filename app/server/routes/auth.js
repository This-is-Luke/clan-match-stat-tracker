const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Register User
router.post('/register', async (req, res) => {
    // Your registration logic here
});

// Login User
router.post('/login', async (req, res) => {
    // Your login logic here
});

// Get Logged In User
router.get('/user', auth, async (req, res) => {
    // Your logic to return logged in user data
});

module.exports = router;