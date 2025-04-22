const Joi = require('joi');

exports.createUserSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(30).required(),
    role: Joi.string().valid('user', 'admin').default('user'),
});

exports.updateUserSchema = createUserSchema.or('name', 'email', 'password', 'role');
