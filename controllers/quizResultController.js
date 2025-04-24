const QuizResultService = require('../services/quizResultService');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');
const QuizResult = require('../models/quizResult');
const User = require('../models/user');
const mongoose = require('mongoose');

exports.createQuizResult = async (req, res, next) => {
    try {
        logger.info('Creating new quiz result', {
            userId: req.body.userId,
            quizId: req.body.quizId,
            path: req.path,
            method: req.method,
        });

        const quizResult = await QuizResultService.create(req.body);

        logger.info('Quiz result created successfully', {
            quizResultId: quizResult._id,
            userId: quizResult.userId,
        });

        res.status(201).json({ message: 'Quiz result created', quizResult });
    } catch (error) {
        logger.error('Error creating quiz result', {
            error: error.message,
            userId: req.body.userId,
            quizId: req.body.quizId,
        });
        next(error);
    }
};

exports.getQuizResult = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        logger.info('Getting quiz result', {
            quizResultId: id,
            userId,
        });

        const quizResult = await QuizResultService.getById(id);

        // Kiểm tra xem người dùng có quyền xem kết quả này không
        if (quizResult.userId.toString() !== userId.toString()) {
            logger.warn('Unauthorized access to quiz result', {
                quizResultId: id,
                userId,
            });
            throw new AppError('Unauthorized access', 403, 'Unauthorized');
        }

        logger.info('Quiz result fetched successfully', {
            quizResultId: id,
            userId,
        });

        res.status(200).json({
            success: true,
            data: quizResult,
        });
    } catch (error) {
        logger.error('Error getting quiz result', {
            error: error.message,
            quizResultId: req.params.id,
            userId: req.user._id,
        });
        next(error);
    }
};

exports.getUserQuizResults = async (req, res, next) => {
    try {
        logger.info('Fetching user quiz results', {
            userId: req.params.userId,
            path: req.path,
            method: req.method,
        });

        const quizResults = await QuizResultService.getByUserId(req.params.userId);

        logger.info('User quiz results fetched successfully', {
            userId: req.params.userId,
            count: quizResults.length,
        });

        res.json(quizResults);
    } catch (error) {
        logger.error('Error fetching user quiz results', {
            error: error.message,
            userId: req.params.userId,
        });
        next(error);
    }
};

exports.getQuizHistory = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const query = req.query;

        logger.info('Getting quiz history', {
            userId,
            query,
        });

        const result = await QuizResultService.getByUserId(userId, query);

        // Populate quiz and user
        const populatedResults = await Promise.all(
            result.data.map(async (quizResult) => {
                const populated = await QuizResult.findById(quizResult._id)
                    .populate('quizId')
                    .populate('userId', 'username email');
                return populated;
            }),
        );

        logger.info('Quiz history fetched successfully', {
            userId,
            count: populatedResults.length,
            total: result.pagination.total,
        });

        res.status(200).json({
            success: true,
            data: populatedResults,
            pagination: result.pagination,
        });
    } catch (error) {
        logger.error('Error getting quiz history', {
            error: error.message,
            userId: req.user._id,
        });
        next(error);
    }
};

exports.getUserStatistics = async (req, res, next) => {
    try {
        const userId = req.user._id;

        logger.info('Getting user quiz statistics', { userId });

        const statistics = await QuizResultService.getStatistics(userId);

        logger.info('User quiz statistics fetched successfully', {
            userId,
            statistics,
        });

        res.status(200).json({
            success: true,
            data: statistics,
        });
    } catch (error) {
        logger.error('Error getting user statistics', {
            error: error.message,
            userId: req.user._id,
        });
        next(error);
    }
};

exports.getQuizLeaderboard = async (req, res, next) => {
    try {
        const { quizId } = req.params;
        logger.info('Getting quiz leaderboard', { quizId });

        const leaderboard = await QuizResult.aggregate([
            // Match completed quiz results for the specific quiz
            {
                $match: {
                    quizId: new mongoose.Types.ObjectId(quizId),
                    status: 'completed',
                },
            },
            // Sort by score (descending) and timeSpent (ascending)
            {
                $sort: {
                    score: -1,
                    timeSpent: 1,
                },
            },
            // Limit to top 3 results
            { $limit: 3 },
            // Join with users collection to get user details
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            // Unwind the user array (since lookup returns an array)
            { $unwind: '$user' },
            // Project only the fields we need
            {
                $project: {
                    _id: 0,
                    username: '$user.username',
                    score: 1,
                    timeSpent: 1,
                    completedAt: 1,
                },
            },
        ]);

        logger.info('Quiz leaderboard retrieved successfully', {
            quizId,
            count: leaderboard.length,
        });

        res.status(200).json({
            message: 'Quiz leaderboard retrieved successfully',
            data: leaderboard,
        });
    } catch (error) {
        logger.error('Error getting quiz leaderboard', {
            error: error.message,
            quizId: req.params.quizId,
        });
        next(error);
    }
};
