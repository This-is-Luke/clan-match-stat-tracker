const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { check } = require('express-validator');

// Register new user
router.post('/register', [
    check('gamerTag', 'GamerTag is required').not().isEmpty(),
    check('userName', 'UserName is required').not().isEmpty(),
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
], validate, async (req, res) => {
    const { gamerTag, userName, name, email, password, role } = req.body;

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
            role: role || 'User', // Default role is 'User'
            assigned: false // New users are not assigned to a clan by default
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id,
                role: user.role,
                assigned: user.assigned
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: 360000
        }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Login user
router.post('/login', [
    check('identifier', 'Please include a valid userName or gamerTag').not().isEmpty(),
    check('password', 'Password is required').exists()
], validate, async (req, res) => {
    const { identifier, password } = req.body;

    try {
        let user = await User.findOne({ $or: [{ userName: identifier }, { gamerTag: identifier }] });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role,
                assigned: user.assigned
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: 360000
        }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
