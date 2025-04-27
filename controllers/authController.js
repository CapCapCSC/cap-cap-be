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
        AuthService.logout(refreshToken);
        logger.info('Logout attempt');
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
        const { token, newPassword } = req.body;

        logger.info('Reset password attempt', { token });

        await AuthService.resetPassword(token, newPassword);
        res.status(200).json({
            message: 'Password reset successfully',
        });
    } catch (error) {
        next(error);
    }
};

exports.verifyResetToken = async (req, res, next) => {
    try {
        const { token } = req.body;

        logger.info('Verify reset token attempt', { token });

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            logger.warn('Invalid or expired reset token', { token });
            throw new AppError('Invalid or expired token', 400, 'ValidationError');
        }

        logger.info('Reset token verified successfully', { token });
        res.status(200).json({
            message: 'Token is valid',
        });
    } catch (error) {
        next(error);
    }
};
