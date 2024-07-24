const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   GET api/protected
// @desc    Get protected data
// @access  Private
router.get('/', auth, (req, res) => {
    res.json({ msg: 'This is protected data', user: req.user });
});

module.exports = router;
