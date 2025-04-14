const mongoose = require('mongoose');
const schema = mongoose.Schema;

const menuSchema = new schema({
    food: {type: schema.Types.ObjectId, ref: 'Food', required: true},
    price: {type: Number, required: true},
}, {timestamps: true});


const restaurant = new schema({
    name: {type: String, required: true},
    menu: [menuSchema],
    imageUrl: {type: String},
    locationUrl: {type: String},
}, {timestamps: true});

module.exports = mongoose.model('Restaurant', restaurant);
