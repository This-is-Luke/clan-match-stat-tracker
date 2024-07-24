const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const { role } = require('../middleware/auth');
const { db } = require('../src/firebase'); // Import Firestore

// Get a list of all users
router.get('/users', [auth, role(['Admin'])], async (req, res) => {
    try {
        const usersRef = db.collection('users');
        const snapshot = await usersRef.get();
        const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Create a new manager
router.post('/create-manager', [auth, role(['Admin'])], async (req, res) => {
    const { gamerTag, userName, name, email, password } = req.body;

    try {
        const userRef = db.collection('users');
        const existingUserSnapshot = await userRef.where('email', '==', email).get();

        if (!existingUserSnapshot.empty) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            gamerTag,
            userName,
            name,
            email,
            password: hashedPassword,
            role: 'Manager',
            assigned: false,
        };

        const docRef = await userRef.add(newUser);
        const savedUser = (await docRef.get()).data();

        res.json({ id: docRef.id, ...savedUser });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Additional CRUD operations can be added here

module.exports = router;
