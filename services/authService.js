const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { generateAccessToken, generateRefreshToken, generateResetPasswordToken } = require('../utils/token');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');
const crypto = require('crypto');

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

        let decoded;
        try {
            decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret');
        } catch (error) {
            logger.warn('Refresh token failed - Invalid token', { error: error.message });
            throw new AppError('Invalid refresh token', 401, 'AuthenticationError');
        }

        const user = await User.findById(decoded._id);
        if (!user) {
            logger.warn('Refresh token failed - User not found', { refreshToken });
            throw new AppError('Invalid refresh token', 401, 'AuthenticationError');
        }

        if (user.refreshToken !== refreshToken) {
            logger.warn('Refresh token failed - Token mismatch', { refreshToken });
            throw new AppError('Invalid refresh token', 401, 'AuthenticationError');
        }

        const tokenPayload = {
            _id: user._id,
            email: user.email,
            role: user.role,
        };

        const newAccessToken = generateAccessToken(tokenPayload);
        const newRefreshToken = generateRefreshToken(tokenPayload);

        // Cập nhật refresh token mới
        user.accessToken = newAccessToken;
        user.refreshToken = newRefreshToken;
        await user.save();

        return { user, newAccessToken, newRefreshToken };
    } catch (error) {
        logger.error('Error in refresh token', { error: error.message });
        throw new AppError('Error in refresh token', 500, 'ServerError');
    }
};

exports.logout = async (refreshToken) => {
    try {
        if (!refreshToken) {
            logger.warn('Logout failed - No token provided');
            throw new AppError('No refresh token provided', 400, 'ValidationError');
        }

        const user = await User.findOne({ refreshToken });
        if (user) {
            user.refreshToken = null;
            await user.save();
            logger.info('Logout successful', {
                userId: user._id,
            });
        }
    } catch (error) {
        logger.error('Error in logout', { error: error.message });
        throw new AppError('Error in logout', 500, 'ServerError');
    }
};

exports.forgotPassword = async (email) => {
    try {
        logger.info('Processing forgot password request', { email });

        const user = await User.findOne({ email });
        if (!user) {
            logger.warn('User not found for forgot password', { email });
            throw new AppError('User not found', 404, 'NotFound');
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        // Update user with reset token
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();

        // Create JWT token with user data
        const tokenPayload = {
            id: user._id,
            email: user.email,
            role: user.role,
        };

        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        // Send email with reset link
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        await sendEmail({
            to: user.email,
            subject: 'Password Reset Request',
            text: `To reset your password, click the following link: ${resetUrl}\nIf you did not request this, please ignore this email.`,
        });

        logger.info('Password reset email sent', { email });
        return { message: 'Password reset email sent', token };
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
