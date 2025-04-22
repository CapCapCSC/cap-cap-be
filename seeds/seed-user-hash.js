const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const users = [
    {
        _id: '661f7c111111111111111111',
        username: 'admin_user',
        email: 'admin@example.com',
        password: 'admin123',
        badges: [],
        vouchers: [],
        role: 'admin',
        createdAt: new Date('2023-01-01T00:00:00Z'),
    },
    {
        _id: '661f7c222222222222222222',
        username: 'user1',
        email: 'user1@example.com',
        password: 'user123',
        badges: [],
        vouchers: [],
        role: 'user',
        createdAt: new Date('2023-01-02T00:00:00Z'),
    },
];

async function seed() {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/capcap');
    await User.deleteMany({});
    for (const user of users) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await User.create({
            ...user,
            password: hashedPassword,
        });
    }
    console.log('Seeded users with hashed passwords!');
    await mongoose.disconnect();
}

seed();
