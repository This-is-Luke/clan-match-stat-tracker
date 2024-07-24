const request = require('supertest');
const app = require('../../server');
const mongoose = require('mongoose');
const User = require('../../models/User');

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

    it('should login a registered user', async () => {
        // Register a user first
        await request(app)
            .post('/api/auth/register')
            .send({
                gamerTag: 'TestGamer',
                userName: 'testuser',
                name: 'Test User',
                email: 'testuser@example.com',
                password: 'password123'
            });

        // Attempt to login
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'password123'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should not login with incorrect password', async () => {
        // Register a user first
        await request(app)
            .post('/api/auth/register')
            .send({
                gamerTag: 'TestGamer',
                userName: 'testuser',
                name: 'Test User',
                email: 'testuser@example.com',
                password: 'password123'
            });

        // Attempt to login with wrong password
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'wrongpassword'
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('msg', 'Invalid credentials');
    });

    it('should access a protected route with valid token', async () => {
        // Register a user first
        const registerRes = await request(app)
            .post('/api/auth/register')
            .send({
                gamerTag: 'TestGamer',
                userName: 'testuser',
                name: 'Test User',
                email: 'testuser@example.com',
                password: 'password123'
            });

        // Access protected route
        const res = await request(app)
            .get('/api/protectedRoute')
            .set('x-auth-token', registerRes.body.token);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('msg', 'Access granted');
    });

    it('should not access a protected route without token', async () => {
        // Attempt to access protected route without token
        const res = await request(app)
            .get('/api/protectedRoute');
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('msg', 'No token, authorization denied');
    });
});
