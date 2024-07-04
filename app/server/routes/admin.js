// First, we need to bring in some tools that help us do different things
const express = require('express'); // This helps us create a server that listens to requests and sends responses
const router = express.Router(); // This helps us organize our requests neatly, like putting toys in different boxes
const bcrypt = require('bcryptjs'); // This helps us scramble and protect passwords so no one can read them
const auth = require('../middleware/auth'); // This checks if someone is allowed to do certain things
const { role } = require('../middleware/auth'); // This checks what kind of role (like Admin) someone has
const User = require('../models/User'); // This is where we keep information about users
const Clan = require('../models/Clan'); // This is where we keep information about clans (like groups of players)
const Match = require('../models/Match'); // This is where we keep information about matches (like games played)
const Score = require('../models/Score'); // This is where we keep information about scores (like points in games)

// Now, let's make a plan for when someone wants to get a list of all users
router.get('/users', [auth, role(['Admin'])], async (req, res) => {
	// We use 'auth' to check if the person asking is allowed to see the users
	// We use 'role' to check if the person is an Admin

	try {
		const users = await User.find(); // We ask our User database to give us all the users
		res.json(users); // We send the list of users back to the person who asked
	} catch (err) {
		console.error(err.message); // If something goes wrong, we show an error message in the console
		res.status(500).send('Server error'); // We tell the person that there was a server error
	}
});

// Next, let's make a plan for creating a new manager
router.post('/create-manager', [auth, role(['Admin'])], async (req, res) => {
	// We use 'auth' to check if the person is allowed to create a manager
	// We use 'role' to check if the person is an Admin

	// We get the new manager's details from the request (like their name, email, and password)
	const { gamerTag, userName, name, email, password } = req.body;

	try {
		// We check if a user with the same email or userName already exists
		let user = await User.findOne({ $or: [{ email }, { userName }] });

		if (user) {
			// If we find a user, we tell the person that the user already exists
			return res.status(400).json({ msg: 'User already exists' });
		}

		// If we don't find a user, we create a new one with the details we got
		user = new User({
			gamerTag, // The player's gaming nickname
			userName, // The username they will use to log in
			name, // Their real name
			email, // Their email address
			password, // Their password (we will scramble it later)
			role: 'Manager', // We make their role 'Manager'
			assigned: false, // This is extra information, maybe to show they haven't been assigned to a team yet
		});

		const salt = await bcrypt.genSalt(10); // We create some salt to help scramble the password
		user.password = await bcrypt.hash(password, salt); // We scramble (hash) the password with the salt

		await user.save(); // We save the new user in our database
		res.json(user); // We send the new user back to the person who created them
	} catch (err) {
		console.error(err.message); // If something goes wrong, we show an error message in the console
		res.status(500).send('Server error'); // We tell the person that there was a server error
	}
});

// We can add more plans (CRUD operations) here to do other things, like updating or deleting users

module.exports = router; // We export our 'router' so it can be used in other parts of our server
