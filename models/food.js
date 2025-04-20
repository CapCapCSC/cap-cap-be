const mongoose = require('mongoose');
const schema = mongoose.Schema;

const food = new schema(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String },
        ingredients: [{ type: String, default: [] }],
        imgUrl: { type: String },
        tags: [{ type: schema.Types.ObjectId, ref: 'FoodTag' }],
    },
    { timestamps: true },
);

module.exports = mongoose.model('Food', food);
