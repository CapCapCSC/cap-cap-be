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
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                resetPasswordToken: resetToken,
                resetPasswordExpires: resetTokenExpiry,
            },
            { new: true },
        );

        if (!updatedUser) {
            logger.error('Failed to update user with reset token', { userId: user._id });
            throw new AppError('Failed to generate reset token', 500, 'ServerError');
        }

        logger.info('Reset token generated and saved', {
            email,
            resetToken,
            resetTokenExpiry,
            userId: updatedUser._id,
        });

        // Configure nodemailer with Gmail
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        // Send email with reset link
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        await transporter.sendMail({
            from: `"CapCap Support" <${process.env.GMAIL_USER}>`,
            to: user.email,
            subject: 'Password Reset Request',
            text: `To reset your password, click the following link: ${resetUrl}\nIf you did not request this, please ignore this email.`,
        });

        logger.info('Password reset email sent', { email });
        return { message: 'Password reset email sent', token: resetToken };
    } catch (error) {
        logger.error('Error in forgot password', { error: error.message });
        throw new AppError('Error in forgot password', 500, 'ServerError');
    }
};

exports.resetPassword = async (resetToken, newPassword) => {
    try {
        logger.info('Reset password attempt', { resetToken });

        // Log the current time and token details for debugging
        const now = new Date();
        logger.info('Current time and token details', {
            currentTime: now,
            resetToken,
        });

        // First, find user by token only to check if token exists
        const userWithToken = await User.findOne({ resetPasswordToken: resetToken });
        logger.info('User with token found', {
            tokenExists: !!userWithToken,
            tokenExpiry: userWithToken?.resetPasswordExpires,
            currentTime: now,
            storedToken: userWithToken?.resetPasswordToken,
            inputToken: resetToken,
            tokensMatch: userWithToken?.resetPasswordToken === resetToken,
        });

        // Then find user with valid token and not expired
        const user = await User.findOne({
            resetPasswordToken: resetToken,
            resetPasswordExpires: { $gt: now },
        });

        if (!user) {
            if (userWithToken) {
                logger.warn('Token expired', {
                    tokenExpiry: userWithToken.resetPasswordExpires,
                    currentTime: now,
                });
                throw new AppError('Reset token has expired', 400, 'ValidationError');
            } else {
                logger.warn('Invalid token', {
                    resetToken,
                    storedToken: userWithToken?.resetPasswordToken,
                    tokensMatch: userWithToken?.resetPasswordToken === resetToken,
                });
                throw new AppError('Invalid reset token', 400, 'ValidationError');
            }
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user with new password and clear reset token
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                password: hashedPassword,
                resetPasswordToken: undefined,
                resetPasswordExpires: undefined,
            },
            { new: true },
        );

        if (!updatedUser) {
            logger.error('Failed to update password', { userId: user._id });
            throw new AppError('Failed to reset password', 500, 'ServerError');
        }

        logger.info('Password reset successfully', { userId: user._id });
        return { message: 'Password reset successful' };
    } catch (error) {
        logger.error('Error in reset password', { error: error.message });
        throw error;
    }
};
