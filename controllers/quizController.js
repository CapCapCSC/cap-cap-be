const QuizService = require('../services/quizService');
const logger = require('../utils/logger');

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
        const { id } = req.params;
        const { userId, answers, quizResultId } = req.body;

        logger.info('Submitting quiz request received', {
            quizId: id,
            userId,
            quizResultId,
        });

        const result = await QuizService.submitQuiz(id, userId, answers, quizResultId);
        logger.info('Quiz submitted successfully', {
            quizId: id,
            userId,
            quizResultId,
            score: result.score,
        });

        res.status(200).json({ message: 'Quiz submitted', result });
    } catch (error) {
        next(error);
    }
};
