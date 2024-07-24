const mongoose = require('mongoose');
const User = require('../../models/User');

describe('User Model', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should create a new user', async () => {
        const user = new User({
            gamerTag: 'TestGamer',
            userName: 'testuser',
            name: 'Test User',
            email: 'testuser@example.com',
            password: 'password123'
        });

        const savedUser = await user.save();
        expect(savedUser._id).toBeDefined();
        expect(savedUser.email).toBe('testuser@example.com');
    });

    it('should not save user with duplicate email', async () => {
        const user1 = new User({
            gamerTag: 'TestGamer1',
            userName: 'testuser1',
            name: 'Test User 1',
            email: 'testuser@example.com',
            password: 'password123'
        });

        const user2 = new User({
            gamerTag: 'TestGamer2',
            userName: 'testuser2',
            name: 'Test User 2',
            email: 'testuser@example.com',
            password: 'password123'
        });

        await user1.save();
        let err;
        try {
            await user2.save();
        } catch (error) {
            err = error;
        }
        expect(err).toBeDefined();
        expect(err.code).toBe(11000); // Duplicate key error code
    });
});
