const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb+srv://capcapwdaproject:NxUEJpOlzrfAtXTI@wdacapcap.qghke2b.mongodb.net/');
        console.log('Connected Successfully');
    } catch (error) {
        console.log(error);
    }
}

module.exports = { connect };
