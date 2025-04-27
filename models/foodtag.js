const mongoose = require('mongoose');
const schema = mongoose.Schema;

const foodtag = new schema(
    {
        name: { type: String, required: true, unique: true },
        color: { type: String, required: true },
    },
    { timestamps: true },
);

module.exports = mongoose.model('FoodTag', foodtag);
