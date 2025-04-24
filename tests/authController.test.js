const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const authRoutes = require('../routes/authRoutes');
const errorHandler = require('../middlewares/errorHandler');
const User = require('../models/user');

require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use(errorHandler);

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST || process.env.MONGODB_URI);
}, 30000);

beforeEach(async () => {
    await User.deleteMany({ email: { $regex: /testuser_/ } });
});

afterEach(async () => {
    await User.deleteMany({
        email: { $regex: /testuser_/, $options: 'i' },
    });
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

        await request(app).post('/api/auth/register').send({
            username: 'testuser',
            email,
            password: 'password123',
        });

        const secondRes = await request(app).post('/api/auth/register').send({
            username: 'testuser2',
            email,
            password: 'password123',
        });

        expect(secondRes.statusCode).toBe(400);
    });

    it('should login with correct credentials', async () => {
        const email = `testuser_${uuidv4()}@example.com`;
        const password = 'password123';

        const registerRes = await request(app).post('/api/auth/register').send({
            username: 'testuser',
            email,
            password,
        });
        expect(registerRes.statusCode).toBe(201);

        const res = await request(app).post('/api/auth/login').send({
            email,
            password,
        });
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

describe('Password Hashing', () => {
    it('should hash and compare correctly', async () => {
        const password = 'password123';
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const match = await bcrypt.compare(password, hash);
        expect(match).toBe(true);

        const wrongMatch = await bcrypt.compare('wrongpassword', hash);
        expect(wrongMatch).toBe(false);
    });
});
