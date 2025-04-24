const AuthService = require('../services/authService');
const User = require('../models/user');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        logger.info('Registration attempt', {
            email,
            username,
        });

        const user = await AuthService.register(username, email, password);

        logger.info('User registered successfully', {
            userId: user._id,
            email: user.email,
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        logger.info('Login attempt', { email });

        const { user, accessToken, refreshToken } = await AuthService.login(email, password);

        logger.info('Login successful', {
            userId: user._id,
            email: user.email,
        });

        res.status(200).json({
            message: 'Login successful',
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};

exports.refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        logger.info('Refresh token attempt');

        const { user, newAccessToken, newRefreshToken } = await AuthService.refreshToken(refreshToken);

        logger.info('Token refreshed successfully', {
            userId: user._id,
        });

        res.status(200).json({
            message: 'Token refreshed successfully',
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    } catch (error) {
        next(error);
    }
};

exports.logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        logger.info('Logout attempt');

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

        res.status(200).json({
            message: 'Logout successful',
        });
    } catch (error) {
        next(error);
    }
};

exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        logger.info('Forgot password attempt', { email });

        await AuthService.forgotPassword(email);
        logger.info('Forgot password email sent', { email });
        res.status(200).json({
            message: 'Password reset email sent successfully',
        });
    } catch (error) {
        next(error);
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const { resetToken, newPassword } = req.body;

        logger.info('Reset password attempt', { resetToken });

        await AuthService.resetPassword(resetToken, newPassword);
        res.status(200).json({
            message: 'Password reset successfully',
        });
    } catch (error) {
        next(error);
    }
};
