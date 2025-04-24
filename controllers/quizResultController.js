const QuizResultService = require('../services/quizResultService');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');
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
        logger.info('Fetching quiz result', {
            quizResultId: req.params.id,
            path: req.path,
            method: req.method,
        });

        const quizResult = await QuizResultService.getById(req.params.id);

        logger.info('Quiz result fetched successfully', {
            quizResultId: quizResult._id,
            userId: quizResult.userId,
        });

        res.json(quizResult);
    } catch (error) {
        logger.error('Error fetching quiz result', {
            error: error.message,
            quizResultId: req.params.id,
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
