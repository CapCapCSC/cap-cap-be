const Joi = require('joi');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

// Create validation schemas

const createUserSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(30).required(),
    role: Joi.string().valid('user', 'admin').default('user'),
});

exports.createUserSchema = createUserSchema;

exports.createRestaurantSchema = Joi.object({
    name: Joi.string().required(),
});

exports.createFoodSchema = Joi.object({
    name: Joi.string().required(),
});

exports.createFoodTagSchema = Joi.object({
    name: Joi.string().required(),
});

exports.createQuestionSchema = Joi.object({
    content: Joi.string().required(),
    correctAnswer: Joi.array().items(Joi.string()).required(),
    incorrectAnswer: Joi.array().items(Joi.string()).required(),
});

exports.createQuizSchema = Joi.object({
    name: Joi.string().required(),
    questions: Joi.array().required(),
});

exports.createVoucherSchema = Joi.object({
    name: Joi.string().required(),
    validUntil: Joi.date().required(),
    discountValue: Joi.number().required(),
});

exports.createBadgeSchema = Joi.object({
    name: Joi.string().required(),
});

// Update validation schemas

exports.updateUserSchema = createUserSchema.or('name', 'email', 'password', 'role');

const registerSchema = Joi.object({
    username: Joi.string().required().min(3).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6).max(30),
    role: Joi.string().valid('user', 'admin').default('user'),
});

const loginSchema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
});

const foodSchema = Joi.object({
    name: Joi.string().required().min(2).max(100),
    description: Joi.string().required().min(10).max(500),
    price: Joi.number().required().min(0),
    category: Joi.string().required().valid('appetizer', 'main', 'dessert', 'drink'),
    image: Joi.string().uri().required(),
});

const questionSchema = Joi.object({
    question: Joi.string().required().min(10).max(500),
    options: Joi.array().items(Joi.string().required()).length(4).required(),
    correctAnswer: Joi.number().required().min(0).max(3),
    category: Joi.string().required().valid('food', 'drink', 'general'),
});

const quizSchema = Joi.object({
    title: Joi.string().required().min(5).max(100),
    description: Joi.string().required().min(10).max(500),
    questions: Joi.array().items(Joi.string().required()).min(5).max(20).required(),
    timeLimit: Joi.number().required().min(5).max(60),
    passingScore: Joi.number().required().min(0).max(100),
});

const validateSchema = (schema) => {
    return (req, res, next) => {
        try {
            logger.info('Starting validation', {
                path: req.originalUrl,
                method: req.method,
                schema: schema.describe().type,
                body: req.body,
            });

            const { error, value } = schema.validate(req.body, {
                abortEarly: false,
                stripUnknown: true,
            });

            if (error) {
                const errorDetails = error.details.map((detail) => ({
                    field: detail.path.join('.'),
                    message: detail.message,
                    type: detail.type,
                    context: detail.context,
                }));

                logger.warn('Validation failed', {
                    path: req.originalUrl,
                    method: req.method,
                    errors: errorDetails,
                    body: req.body,
                });

                throw new AppError('Validation failed', 400, 'ValidationError', errorDetails);
            }

            // Log successful validation with sanitized data
            logger.info('Validation successful', {
                path: req.originalUrl,
                method: req.method,
                validatedData: value,
            });

            // Attach validated data to request
            req.validatedData = value;
            next();
        } catch (error) {
            next(error);
        }
    };
};

module.exports = {
    registerSchema,
    loginSchema,
    foodSchema,
    questionSchema,
    quizSchema,
    validateSchema,
    ...exports,
};
