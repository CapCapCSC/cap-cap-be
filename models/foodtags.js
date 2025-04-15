const mongoose = require('mongoose');
const schema = mongoose.Schema;

const foodtags = new schema(
    {
        name: { type: String, required: true, unique: true },
    },
    { timestamps: true },
);

module.exports = mongoose.model('FoodTags', foodtags);
