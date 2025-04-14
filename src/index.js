try {
    const db = require('../config/db/');

    db.connect();
} catch (error) {
    console.log(error);
}
