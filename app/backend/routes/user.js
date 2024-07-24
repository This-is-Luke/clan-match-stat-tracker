const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { role } = require('../middleware/auth');

// Apply for clan membership
router.post('/apply-membership', [auth, role(['User'])], async (req, res) => {
    // Logic to send application notification to managers
    res.send('Application for membership sent');
});

// View clan schedules and stats
router.get('/clan-dashboard', [auth, role(['User'])], async (req, res) => {
    if (!req.user.assigned) {
        return res.status(400).json({ msg: 'You need to be assigned to a clan' });
    }
    // Logic to display clan schedules and stats
    res.send('Clan schedules and stats');
});

module.exports = router;
