const mongoose = require('mongoose');
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

module.exports = mongoose.model('User', user);
