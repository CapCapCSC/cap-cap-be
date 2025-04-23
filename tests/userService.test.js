const mongoose = require('mongoose');
const User = require('../models/user');
const userService = require('../services/userService');
require('dotenv').config();

function generateRandomEmail() {
    return `testuser_${Math.random().toString(36).substring(2, 15)}@example.com`;
}

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

describe('User Service', () => {
    it('should create a new user', async () => {
        const email = generateRandomEmail();
        const user = await userService.create({
            username: 'testuser',
            email,
            password: 'password123',
        });
        expect(user.username).toBe('testuser');
        expect(user.email).toBe(email);
    });

    it('should not create user with invalid email', async () => {
        try {
            await userService.create({
                username: 'invalidemail',
                email: 'not-an-email',
                password: 'password123',
            });
        } catch (err) {
            expect(err).toBeDefined();
        }
    });

    it('should not create user with duplicate email', async () => {
        const email = generateRandomEmail();
        await userService.create({
            username: 'testuser1',
            email,
            password: 'password123',
        });
        try {
            await userService.create({
                username: 'testuser2',
                email,
                password: 'password123',
            });
        } catch (err) {
            expect(err).toBeDefined();
        }
    });

    it('should get user by id', async () => {
        const email = generateRandomEmail();
        const user = await userService.create({
            username: 'testuser',
            email,
            password: 'password123',
        });
        expect(user).not.toBeNull();
        const found = await userService.getById(user._id);
        expect(found).not.toBeNull();
        expect(found.username).toBe('testuser');
    });

    it('should throw error when getById with invalid id format', async () => {
        try {
            await userService.getById('not-a-valid-id');
        } catch (err) {
            expect(err).toBeDefined();
        }
    });

    it('should update user info', async () => {
        const email = generateRandomEmail();
        const user = await userService.create({
            username: 'testuser',
            email,
            password: 'password123',
        });
        expect(user).not.toBeNull();
        const updated = await userService.update(user._id, { username: 'updateduser' });
        expect(updated.username).toBe('updateduser');
    });

    it('should not update user with invalid email', async () => {
        const email = generateRandomEmail();
        const user = await userService.create({
            username: 'testuser',
            email,
            password: 'password123',
        });
        try {
            await userService.update(user._id, { email: 'invalid-email' });
        } catch (err) {
            expect(err).toBeDefined();
        }
    });

    it('should delete user', async () => {
        const email = generateRandomEmail();
        const user = await userService.create({
            username: 'testuser',
            email,
            password: 'password123',
        });
        await userService.delete(user._id);
        const deleted = await userService.getById(user._id);
        expect(deleted).toBeNull();
    });

    it('should return null when deleting non-existent user', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const result = await userService.delete(fakeId);
        expect(result).toBe(false);
    });

    it('should return null for non-existent user', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const user = await userService.getById(fakeId);
        expect(user).toBeNull();
    });
});
