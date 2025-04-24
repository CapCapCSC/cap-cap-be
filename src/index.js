const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const requestLogger = require('../middlewares/requestLogger');
const errorLogger = require('../middlewares/errorLogger');
const logger = require('../utils/logger');

try {
    const db = require('../config/db/');
    db.connect();

    const app = express();
    const PORT = process.env.PORT || 3000;

    app.use(cors());
    app.use(bodyParser.json());

    // Logging middleware
    app.use(requestLogger);

    // Routes
    app.use('/api/auth', require('../routes/authRoutes'));
    app.use('/api/vouchers', require('../routes/voucherRoutes'));
    app.use('/api/users', require('../routes/userRoutes'));
    app.use('/api/restaurants', require('../routes/restaurantRoutes'));
    app.use('/api/quizzes', require('../routes/quizRoutes'));
    app.use('/api/questions', require('../routes/questionRoutes'));
    app.use('/api/foodtags', require('../routes/foodtagRoutes'));
    app.use('/api/foods', require('../routes/foodRoutes'));
    app.use('/api/badges', require('../routes/badgeRoutes'));

    //Test route
    app.get('/api/', (req, res) => {
        res.json({ message: 'API is running!' });
    });

    // Handle 404 errors
    app.use((req, res, next) => {
        const err = new Error('Endpoint not found');
        err.status = 404;
        err.name = 'NotFound';
        next(err);
    });

    app.use(errorLogger);
    app.use(errorHandler);

    app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`);
    });
} catch (error) {
    logger.error('Failed to start server:', error);
}
