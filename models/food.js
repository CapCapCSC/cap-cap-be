const mongoose = require('mongoose');
const schema = mongoose.Schema;

const food = new schema(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String },
        imgUrl: { type: String },
        relatedFoods: [{ type: schema.Types.ObjectId, ref: 'Food' }],
    },
    { timestamps: true },
);

module.exports = mongoose.model('Food', food);
