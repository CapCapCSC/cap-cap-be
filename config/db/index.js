const mongoose = require('mongoose');
require('dotenv').config();

async function connect() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected Successfully');
    } catch (error) {
        console.log(error);
    }
}

module.exports = { connect };
