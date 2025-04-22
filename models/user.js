const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const schema = mongoose.Schema;

const user = new schema(
    {
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        badges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }],
        vouchers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Voucher' }],
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        createdAt: { type: Date, default: Date.now },
        refreshToken: { type: String, default: '' },
    },
    { timestamps: true },
);

user.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

user.pre('save', function (next) {
    if (this.email) {
        this.email = this.email.toLowerCase();
    }
    next();
});

module.exports = mongoose.model('User', user);
