const mongoose = require('mongoose');
const schema = mongoose.Schema;

const voucher = new schema(
    {
        name: { type: String, required: true },
        validUntil: { type: Date, required: true },
        applicableRestaurants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Restaurant',
                required: true,
            },
        ],
        used: { type: Boolean, default: false },
    },
    { timestamps: true },
);

module.exports = mongoose.model('Voucher', voucher);
