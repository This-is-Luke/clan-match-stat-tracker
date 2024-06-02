const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { role } = require('../middleware/auth');
const Clan = require('../models/Clan');
const Match = require('../models/Match');
const Score = require('../models/Score');
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
            assigned: true,
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

// Create a match
router.post('/create-match', [auth, role(['Manager'])], async (req, res) => {
    const { clan1, clan2, date, gameMode } = req.body;

    try {
        const match = new Match({
            clan1,
            clan2,
            date,
            gameMode
        });

        await match.save();
        res.json(match);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Record a score
router.post('/record-score', [auth, role(['Manager'])], async (req, res) => {
    const { match, clan, players, score, gameModeStats } = req.body;

    try {
        const newScore = new Score({
            match,
            clan,
            players,
            score,
            gameModeStats
        });

        await newScore.save();
        res.json(newScore);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
