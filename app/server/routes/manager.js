const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { role } = require('../middleware/auth');
const User = require('../models/User');

// Get clan users (assigned by this manager)
router.get('/clan-users', [auth, role(['Manager'])], async (req, res) => {
    try {
        const users = await User.find({ assigned: true, managerId: req.user.id });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Create a clan user
router.post('/create-user', [auth, role(['Manager'])], async (req, res) => {
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
            role: 'User',
            assigned: true||false,
            managerId: req.user.id
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

// Other CRUD operations for users within the manager's clan can be added here

module.exports = router;
