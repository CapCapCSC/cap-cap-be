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

        const quiz = await Quiz.findById(id).populate('questions');
        if (!quiz) {
            logger.warn('Quiz not found', { quizId: id });
            throw new AppError('Quiz not found', 404, 'NotFound');
        }

        const startTime = new Date();
        const quizResult = await QuizResultService.create({
            userId,
            quizId: id,
            score: 0,
            correctAnswers: 0,
            totalQuestions: quiz.questions.length,
            answers: [],
            startedAt: startTime,
            completedAt: startTime,
            timeSpent: 0,
            status: 'in_progress',
        });

        logger.info('Quiz started successfully', {
            quizId: id,
            userId,
            quizResultId: quizResult._id,
        });

        res.status(200).json({
            success: true,
            quiz: quiz.toObject(),
            quizResult: quizResult.toObject(),
        });
    } catch (error) {
        logger.error('Error starting quiz', {
            error: error.message,
            quizId: req.params.id,
            userId: req.user._id,
        });
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

        // Get quiz
        const quiz = await QuizService.getById(quizId);
        if (!quiz) {
            logger.warn('Quiz not found', { quizId });
            throw new AppError('Quiz not found', 404, 'NotFound');
        }

        // Calculate score
        const scoreResult = await QuizResultService.calculateScore(quizId, answers);

        // Create quiz result
        const startTime = new Date(Date.now() - timeSpent * 1000);
        const completedAt = new Date();

        const quizResult = await QuizResultService.create({
            userId,
            quizId,
            answers: answers.map((answer) => ({
                questionId: answer.questionId,
                selectedAnswer: answer.selectedAnswer,
                timeSpent: answer.timeSpent || 0,
            })),
            score: scoreResult.score,
            correctAnswers: scoreResult.correctAnswers,
            totalQuestions: quiz.questions.length,
            timeSpent,
            status: 'completed',
            startedAt: startTime,
            completedAt,
        });

        // Award rewards if high score
        let rewards = null;
        if (scoreResult.isHighScore) {
            rewards = await QuizResultService.awardRewards(userId, quiz, quizResult);
            quizResult.rewards = rewards;
            await quizResult.save();
        }

        logger.info('Quiz submitted successfully', {
            quizId,
            userId,
            score: scoreResult.score,
            isHighScore: scoreResult.isHighScore,
        });

        res.status(200).json({
            success: true,
            data: {
                ...quizResult.toObject(),
                isHighScore: scoreResult.isHighScore,
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
