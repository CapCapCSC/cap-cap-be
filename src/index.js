const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

try {
    const db = require('../config/db/');
    db.connect();

    const app = express();
    const PORT = process.env.PORT || 3000;

    const authRoutes = require('../routes/authRoutes');
    app.use('/api/auth', authRoutes);

    app.use(cors());
    app.use(bodyParser.json());

    // Routes
    app.use('/api/vouchers', require('../routes/voucherRoutes'));
    app.use('/api/users', require('../routes/userRoutes'));
    app.use('/api/restaurants', require('../routes/restaurantRoutes'));
    app.use('/api/quizzes', require('../routes/quizRoutes'));
    app.use('/api/questions', require('../routes/questionRoutes'));
    app.use('/api/foodtags', require('../routes/foodtagRoutes'));
    app.use('/api/foods', require('../routes/foodRoutes'));
    app.use('/api/badges', require('../routes/badgeRoutes'));

    app.get('/api/', (req, res) => {
        res.json({ message: 'API is running!' });
    });

    // Handle 404 errors
    app.use((req, res, next) => {
        res.status(404).json({ error: 'NotFound', message: 'Endpoint not found', status: 404 });
    });

    // Handle server errors
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({
            error: 'InternalServerError',
            message: 'An internal server error occurred.',
            status: 500,
        });
    });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
} catch (error) {
    console.error('Failed to start server:', error);
}
