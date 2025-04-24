const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { generateAccessToken, generateRefreshToken, generateResetPasswordToken } = require('../utils/token');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

exports.register = async (username, email, password) => {
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            logger.warn('Registration failed - Email exists', { email });
            throw new AppError('Email already exists', 400, 'ValidationError');
        }

        if (!password || typeof password !== 'string') {
            logger.warn('Registration failed - Invalid password format', { email });
            throw new AppError('Invalid password format', 400, 'ValidationError');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role: 'user',
        });
        return user;
    } catch (error) {
        logger.error('Error in create user', { error: error.message });
        throw new AppError('Error in create user', 500, 'ServerError');
    }
};

exports.login = async (email, password) => {
    try {
        const user = await User.findOne({ email }).select('+password').collation({ locale: 'en', strength: 2 }).exec();

        if (!user) {
            logger.warn('Login failed - User not found', { email });
            throw new AppError('Invalid email or password', 401, 'AuthenticationError');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logger.warn('Login failed - Invalid password', { email });
            throw new AppError('Invalid email or password', 401, 'AuthenticationError');
        }

        const tokenPayload = {
            _id: user._id,
            email: user.email,
            role: user.role,
        };

        const accessToken = generateAccessToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);

        // Lưu refresh token vào database
        user.refreshToken = refreshToken;
        await user.save();

        return { user, accessToken, refreshToken };
    } catch (error) {
        logger.error('Error in login', { error: error.message });
        throw new AppError('Error in login', 500, 'ServerError');
    }
};

exports.refreshToken = async (refreshToken) => {
    try {
        if (!refreshToken) {
            logger.warn('Refresh token failed - No token provided');
            throw new AppError('No refresh token provided', 400, 'ValidationError');
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            logger.warn('Refresh token failed - Invalid token');
            throw new AppError('Invalid refresh token', 401, 'AuthenticationError');
        }

        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        // Cập nhật refresh token mới
        user.refreshToken = newRefreshToken;
        await user.save();

        return { user, newAccessToken, newRefreshToken };
    } catch (error) {
        logger.error('Error in refresh token', { error: error.message });
        throw new AppError('Error in refresh token', 500, 'ServerError');
    }
};

exports.forgotPassword = async (email) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            logger.warn('Forgot password - User not found', { email });
            throw new AppError('User not found', 404, 'ValidationError');
        }

        // Generate reset password token and save it to the user document
        const resetToken = generateResetPasswordToken(user);
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1h
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Password Reset',
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
        });

        logger.info('Forgot password - Email sent', { email });
        return { message: 'Reset password email sent' };
    } catch (error) {
        logger.error('Error in forgot password', { error: error.message });
        throw new AppError('Error in forgot password', 500, 'ServerError');
    }
};

exports.resetPassword = async (resetToken, newPassword) => {
    let payload;
    try {
        // Validate token
        payload = jwt.verify(resetToken, process.env.JWT_SECRET);

        const user = await User.findOne({
            _id: payload.userId,
            resetPasswordToken: resetToken,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

        // Reset password
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        logger.info('Password reset successfully', {});
    } catch (error) {
        logger.error('Error in reset password', { error: error.message });
        throw new AppError('Invalid or expired token', 400, 'ValidationError');
    }
};
