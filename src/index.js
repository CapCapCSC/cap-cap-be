require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('../config/cors.config');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('../config/swagger');
const errorHandler = require('../middlewares/errorHandler');
const requestLogger = require('../middlewares/requestLogger');
const errorLogger = require('../middlewares/errorLogger');
const logger = require('../utils/logger');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors);
app.use(bodyParser.json());
app.use(requestLogger);

// Swagger Documentation
app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpecs, {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'CapCap API Documentation',
    }),
);

// Rate limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Routes
app.use('/api/auth', require('../routes/authRoutes'));
app.use('/api/vouchers', require('../routes/voucherRoutes'));
app.use('/api/users', require('../routes/userRoutes'));
app.use('/api/restaurants', require('../routes/restaurantRoutes'));
app.use('/api/quiz-results', require('../routes/quizResultRoutes'));
app.use('/api/quizzes', require('../routes/quizRoutes'));
app.use('/api/questions', require('../routes/questionRoutes'));
app.use('/api/foodtags', require('../routes/foodTagRoutes'));
app.use('/api/foods', require('../routes/foodRoutes'));
app.use('/api/badges', require('../routes/badgeRoutes'));
app.use('/api/upload', require('../routes/uploadRoutes'));

// Test route
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

// Only start the server if this file is run directly
if (require.main === module) {
    try {
        const db = require('../config/db/');
        db.connect();

        app.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
    }
}

module.exports = app;
