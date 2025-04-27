const QuizService = require('../services/quizService');
const logger = require('../utils/logger');
const Quiz = require('../models/quiz');
const QuizResult = require('../models/quizResult');
const User = require('../models/user');
const AppError = require('../utils/AppError');
const QuizResultService = require('../services/quizResultService');

exports.createQuiz = async (req, res, next) => {
    try {
        logger.info('Creating quiz request received', {
            body: req.body,
        });

        const quiz = await QuizService.create(req.body);
        logger.info('Quiz created successfully', {
            quizId: quiz._id,
            title: quiz.title,
        });

        res.status(201).json({ message: 'Quiz created', quiz });
    } catch (error) {
        next(error);
    }
};

exports.getAllQuizzes = async (req, res, next) => {
    try {
        logger.info('Get all quizzes request received', {
            query: req.query,
        });

        const quizzes = await QuizService.getAll(req.query);
        logger.info('Quizzes fetched successfully', {
            count: quizzes.data.length,
            total: quizzes.pagination.total,
        });

        res.status(200).json(quizzes);
    } catch (error) {
        next(error);
    }
};

exports.getQuizById = async (req, res, next) => {
    try {
        logger.info('Get quiz by ID request received', {
            quizId: req.params.id,
        });

        const quiz = await QuizService.getById(req.params.id);
        logger.info('Quiz fetched successfully', {
            quizId: quiz._id,
            title: quiz.title,
        });

        res.status(200).json(quiz);
    } catch (error) {
        next(error);
    }
};

exports.updateQuiz = async (req, res, next) => {
    try {
        logger.info('Update quiz request received', {
            quizId: req.params.id,
            updateData: req.body,
        });

        const quiz = await QuizService.update(req.params.id, req.body);
        logger.info('Quiz updated successfully', {
            quizId: quiz._id,
            title: quiz.title,
        });

        res.status(200).json({ message: 'Quiz updated', quiz });
    } catch (error) {
        next(error);
    }
};

exports.deleteQuiz = async (req, res, next) => {
    try {
        logger.info('Delete quiz request received', {
            quizId: req.params.id,
        });

        await QuizService.delete(req.params.id);
        logger.info('Quiz deleted successfully', {
            quizId: req.params.id,
        });

        res.status(200).json({ message: 'Quiz deleted' });
    } catch (error) {
        next(error);
    }
};

exports.startQuiz = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        logger.info('Starting quiz request received', {
            quizId: id,
            userId,
        });

        const result = await QuizService.startQuiz(id, userId);

        logger.info('Quiz started successfully', {
            quizId: id,
            userId,
            quizResultId: result.quizResult._id,
        });

        res.status(200).json({
            success: true,
            data: {
                quiz: result.quiz,
                quizResult: result.quizResult,
            },
        });
    } catch (error) {
        next(error);
    }
};

exports.submitQuiz = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const { answers } = req.body;

        logger.info('Submitting quiz request received', {
            quizId: id,
            userId,
            answerCount: answers.length,
        });

        const quizResult = await QuizService.submitQuiz(id, userId, answers);

        logger.info('Quiz submitted successfully', {
            quizId: id,
            userId,
            quizResultId: quizResult._id,
            score: quizResult.score,
            timeSpent: quizResult.timeSpent,
        });

        res.status(200).json({
            success: true,
            data: quizResult,
        });
    } catch (error) {
        next(error);
    }
};

exports.getQuizStatistics = async (req, res, next) => {
    try {
        const { id } = req.params;

        logger.info('Get quiz statistics request received', {
            quizId: id,
        });

        const statistics = await QuizService.getStatistics(id);

        logger.info('Quiz statistics fetched successfully', {
            quizId: id,
        });

        res.status(200).json({
            success: true,
            data: statistics,
        });
    } catch (error) {
        next(error);
    }
};

exports.getUserQuizHistory = async (req, res, next) => {
    try {
        logger.info('Get user quiz history request received', {
            userId: req.user._id,
        });

        const results = await QuizResult.find({
            userId: req.user._id,
            status: 'completed',
        }).populate('quizId');

        logger.info('User quiz history fetched successfully', {
            userId: req.user._id,
            count: results.length,
        });

        res.status(200).json({
            success: true,
            data: results.map((result) => result.toObject()),
        });
    } catch (error) {
        logger.error('Error getting user quiz history', {
            error: error.message,
            userId: req.user._id,
        });
        next(error);
    }
};
