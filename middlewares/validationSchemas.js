const Joi = require('joi');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

// Create validation schemas

const createUserSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(30).required(),
    role: Joi.string().valid('user', 'admin').default('user'),
});

exports.createUserSchema = createUserSchema;

exports.createRestaurantSchema = Joi.object({
    name: Joi.string().required(),
    menu: Joi.array().items(
        Joi.object({
            food: Joi.string().required(),
            price: Joi.number().required(),
        }),
    ),
    imageUrl: Joi.string().uri(),
    address: Joi.string(),
    districtId: Joi.string(),
    locationUrl: Joi.string().uri(),
});

exports.createFoodSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
    ingredients: Joi.array().items(Joi.string()),
    imgUrl: Joi.string().uri(),
    tags: Joi.array().items(Joi.string()),
});

exports.createFoodTagSchema = Joi.object({
    name: Joi.string().required(),
    color: Joi.string(),
});

exports.createQuestionSchema = Joi.object({
    content: Joi.string().required(),
    correctAnswer: Joi.array().items(Joi.string()).required(),
    incorrectAnswer: Joi.array().items(Joi.string()).required(),
    relatedFood: Joi.string(),
});

exports.createQuizSchema = Joi.object({
    name: Joi.string().required(),
    questions: Joi.array().required(),
    description: Joi.string(),
    imageUrl: Joi.string().uri(),
    dateCreated: Joi.date(),
    validUntil: Joi.date(),
    timeLimit: Joi.number().required().min(0),
    passingScore: Joi.number().required().min(0).max(100),
    rewardBadge: Joi.string(),
    rewardVoucher: Joi.string(),
    isActive: Joi.boolean().default(true),
    statistics: Joi.object({
        totalAttempts: Joi.number().default(0),
        averageScore: Joi.number().default(0),
        completionRate: Joi.number().default(0),
        averageTimeSpent: Joi.number().default(0),
    })
});

exports.createVoucherSchema = Joi.object({
    name: Joi.string().required(),
    validUntil: Joi.date().required(),
    discountValue: Joi.number().required(),
});

exports.createBadgeSchema = Joi.object({
    name: Joi.string().required(),
    iconUrl: Joi.string().uri().required(),
    description: Joi.string().required(),
});

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

exports.submitQuizSchema = Joi.object({
    quizId: Joi.string().required().hex().length(24).messages({
        'string.hex': 'Invalid quiz ID format',
        'string.length': 'Invalid quiz ID length',
        'any.required': 'Quiz ID is required',
    }),
    answers: Joi.array()
        .items(
            Joi.object({
                questionId: Joi.string().required().hex().length(24).messages({
                    'string.hex': 'Invalid question ID format',
                    'string.length': 'Invalid question ID length',
                    'any.required': 'Question ID is required',
                }),
                selectedAnswer: Joi.string().required().messages({
                    'any.required': 'Selected answer is required',
                }),
                timeSpent: Joi.number().min(0).default(0).messages({
                    'number.min': 'Time spent must be a positive number',
                }),
            }),
        )
        .required()
        .min(1)
        .messages({
            'array.min': 'At least one answer is required',
            'any.required': 'Answers array is required',
        }),
    timeSpent: Joi.number().required().min(0).messages({
        'number.min': 'Total time spent must be a positive number',
        'any.required': 'Total time spent is required',
    }),
});

// Schema cho lấy lịch sử làm bài
exports.getQuizHistorySchema = Joi.object({
    page: Joi.number().min(1).default(1).messages({
        'number.min': 'Page must be greater than 0',
    }),
    limit: Joi.number().min(1).max(50).default(10).messages({
        'number.min': 'Limit must be greater than 0',
        'number.max': 'Limit cannot exceed 50',
    }),
    status: Joi.string().valid('completed', 'in_progress', 'abandoned').messages({
        'any.only': 'Invalid status value',
    }),
    startDate: Joi.date().iso().messages({
        'date.format': 'Start date must be in ISO format',
    }),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).messages({
        'date.format': 'End date must be in ISO format',
        'date.min': 'End date must be after start date',
    }),
});

exports.updateUserSchema = Joi.object({
    username: Joi.string().min(3).max(30),
    email: Joi.string().email(),
    password: Joi.string().min(6).max(30),
    role: Joi.string().valid('user', 'admin'),
    avatar: Joi.string().uri(),
}).or('username', 'email', 'password', 'role', 'avatar');

module.exports = {
    registerSchema,
    loginSchema,
    foodSchema,
    questionSchema,
    quizSchema,
    validateSchema,
    ...exports,
};
