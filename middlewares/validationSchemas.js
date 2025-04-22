const Joi = require('joi');

// Ctreate validation schemas

exports.createUserSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(30).required(),
    role: Joi.string().valid('user', 'admin').default('user'),
});

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
