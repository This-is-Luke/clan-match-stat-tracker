const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const { role } = require('../middleware/auth');
const User = require('../models/User');
const Clan = require('../models/Clan');
const Match = require('../models/Match');
const Score = require('../models/Score');

// Get all users
router.get('/users', [auth, role(['Admin'])], async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Create a manager
router.post('/create-manager', [auth, role(['Admin'])], async (req, res) => {
    const { gamerTag, userName, name, email, password } = req.body;

    try {
        let user = await User.findOne({ $or: [{ email }, { userName }] });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            gamerTag,
            userName,
            name,
            email,
            password,
            role: 'Manager',
            assigned: false
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Other CRUD operations can be added here

module.exports = router;
