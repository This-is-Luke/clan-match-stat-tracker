const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User');

// Clear the test database after each test
afterEach(async () => {
    await User.deleteMany({});
});

// Close the database connection after all tests
afterAll(async () => {
    await mongoose.connection.close();
});

describe('Auth API', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                gamerTag: 'TestGamer',
                userName: 'testuser',
                name: 'Test User',
                email: 'testuser@example.com',
                password: 'password123'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should not register a user with an existing email', async () => {
        // Register the first user
        await request(app)
            .post('/api/auth/register')
            .send({
                gamerTag: 'TestGamer',
                userName: 'testuser',
                name: 'Test User',
                email: 'testuser@example.com',
                password: 'password123'
            });

        // Try to register a second user with the same email
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                gamerTag: 'TestGamer2',
                userName: 'testuser2',
                name: 'Test User 2',
                email: 'testuser@example.com',
                password: 'password123'
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('msg', 'User already exists');
    });
});
