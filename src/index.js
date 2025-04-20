const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

try {
    const db = require('../config/db/');
    db.connect();

    const app = express();
    const PORT = process.env.PORT || 3000;

    app.use(cors());
    app.use(bodyParser.json());

    app.get('/api/', (req, res) => {
        res.json({ message: 'API is running!' });
    });

    // Xử lý lỗi 404
    app.use((req, res, next) => {
        res.status(404).json({ error: 'NotFound', message: 'Endpoint not found', status: 404 });
    });

    // Xử lý lỗi server
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({ error: 'InternalServerError', message: 'Đã xảy ra lỗi hệ thống.', status: 500 });
    });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
} catch (error) {
    console.error('Failed to start server:', error);
}
