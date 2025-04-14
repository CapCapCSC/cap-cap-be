const mongoose = require('mongoose');
const schema = mongoose.Schema;

const badge = new schema({
    name: {type: String, required: true, unique: true},
    iconUrl: {type: String},
}, {timestamps: true});

module.exports = mongoose.model('Badge', badge);
