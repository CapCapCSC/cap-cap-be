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
        const { userId } = req.body;

        logger.info('Starting quiz request received', {
            quizId: id,
            userId,
        });

        const { quiz, quizResult } = await QuizService.startQuiz(id, userId);
        logger.info('Quiz started successfully', {
            quizId: quiz._id,
            userId,
            quizResultId: quizResult._id,
        });

        res.status(200).json({ message: 'Quiz started', quiz, quizResult });
    } catch (error) {
        next(error);
    }
};

exports.submitQuiz = async (req, res, next) => {
    try {
        const { quizId, answers, timeSpent } = req.body;
        const userId = req.user._id;

        logger.info('Submitting quiz', {
            quizId,
            userId,
            answerCount: answers.length,
            timeSpent,
        });

        // 1. Tìm quiz
        const quiz = await Quiz.findById(quizId).populate('questions');
        if (!quiz) {
            logger.warn('Quiz not found', { quizId });
            throw new AppError('Quiz not found', 404, 'NotFound');
        }

        // 2. Tính điểm
        const scoreData = await QuizResultService.calculateScore(quiz, answers);

        // 3. Tạo quiz result
        const quizResult = await QuizResultService.createQuizResult(userId, quizId, scoreData, timeSpent);

        // 4. Trao thưởng nếu đạt điểm cao
        const rewards = await QuizResultService.awardRewards(userId, quiz, scoreData);

        logger.info('Quiz submitted successfully', {
            quizResultId: quizResult._id,
            userId,
            score: scoreData.score,
            rewards,
        });

        res.status(200).json({
            success: true,
            data: {
                quizResult,
                score: scoreData.score,
                isHighScore: scoreData.isHighScore,
                rewards,
            },
        });
    } catch (error) {
        logger.error('Error submitting quiz', {
            error: error.message,
            quizId: req.body.quizId,
            userId: req.user._id,
        });
        next(error);
    }
};

exports.getQuizStatistics = async (req, res, next) => {
    try {
        logger.info('Get quiz statistics request received', {
            quizId: req.params.id,
        });

        const statistics = await QuizService.getStatistics(req.params.id);
        logger.info('Quiz statistics fetched successfully', {
            quizId: req.params.id,
            statistics,
        });

        res.status(200).json(statistics);
    } catch (error) {
        next(error);
    }
};

exports.getUserQuizHistory = async (req, res, next) => {
    try {
        logger.info('Get user quiz history request received', {
            userId: req.user._id,
        });

        const history = await QuizService.getUserHistory(req.user._id, req.query);
        logger.info('User quiz history fetched successfully', {
            userId: req.user._id,
            count: history.data.length,
            total: history.pagination.total,
        });

        res.status(200).json(history);
    } catch (error) {
        next(error);
    }
};
