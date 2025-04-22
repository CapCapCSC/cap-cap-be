const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('../routes/authRoutes');
const mongoose = require('mongoose');
const User = require('../models/user');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST || process.env.MONGODB_URI);
}, 30000);

beforeEach(async () => {
    console.log('Clearing test-related users...');
    await User.deleteMany({ email: { $regex: /testuser_/ } });
});

afterAll(async () => {
    await mongoose.disconnect();
}, 30000);

describe('Auth Controller', () => {
    it('should register a new user', async () => {
        const randomEmail = `testuser_${uuidv4()}@example.com`;
        const res = await request(app).post('/api/auth/register').send({
            username: 'testuser',
            email: randomEmail,
            password: 'password123',
        });
        expect(res.statusCode).toBe(201);
        expect(res.body.user.email).toBe(randomEmail);
    });

    it('should not register with existing email', async () => {
        const email = `testuser_${uuidv4()}@example.com`;

        const firstRes = await request(app).post('/api/auth/register').send({
            username: 'testuser',
            email,
            password: 'password123',
        });
        expect(firstRes.statusCode).toBe(201);

        const secondRes = await request(app).post('/api/auth/register').send({
            username: 'testuser2',
            email,
            password: 'password123',
        });
        expect(secondRes.statusCode).toBe(400);
    });

    it('should login with correct credentials', async () => {
        const randomEmail = `testuser_${uuidv4()}@example.com`;

        const registerRes = await request(app).post('/api/auth/register').send({
            username: 'testuser',
            email: randomEmail,
            password: 'password123',
        });
        console.log('Register response:', registerRes.body);
        expect(registerRes.statusCode).toBe(201);

        console.log('Attempting login with:', { email: randomEmail, password: 'password123' }); // Debug log
        const res = await request(app).post('/api/auth/login').send({
            email: randomEmail,
            password: 'password123',
        });
        console.log('Login response:', res.body); // Debug log
        expect(res.statusCode).toBe(200);
        expect(res.body.accessToken).toBeDefined();
    });

    it('should not login with wrong password', async () => {
        const randomEmail = `testuser_${uuidv4()}@example.com`;
        await User.create({
            username: 'testuser',
            email: randomEmail,
            password: await require('bcryptjs').hash('password123', 10),
        });
        const res = await request(app).post('/api/auth/login').send({
            email: randomEmail,
            password: 'wrongpassword',
        });
        expect(res.statusCode).toBe(401);
    });
});
