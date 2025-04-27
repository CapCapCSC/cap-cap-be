const QuestionService = require('../services/questionService');
const logger = require('../utils/logger');

exports.createQuestion = async (req, res, next) => {
    try {
        logger.info('Creating question request received', {
            body: req.body,
        });

        const question = await QuestionService.create(req.body);
        logger.info('Question created successfully', {
            questionId: question._id,
            type: question.type,
        });

        res.status(201).json({ message: 'Question created', question });
    } catch (error) {
        next(error);
    }
};

exports.getAllQuestions = async (req, res, next) => {
    try {
        logger.info('Get all questions request received', {
            query: req.query,
        });

        const questions = await QuestionService.getAll(req.query);
        logger.info('Questions fetched successfully', {
            count: questions.data.length,
            total: questions.pagination.total,
        });

        res.status(200).json(questions);
    } catch (error) {
        next(error);
    }
};

exports.getQuestionById = async (req, res, next) => {
    try {
        logger.info('Get question by ID request received', {
            questionId: req.params.id,
        });

        const question = await QuestionService.getById(req.params.id);
        logger.info('Question fetched successfully', {
            questionId: question._id,
            type: question.type,
        });

        res.status(200).json(question);
    } catch (error) {
        next(error);
    }
};

exports.updateQuestion = async (req, res, next) => {
    try {
        logger.info('Update question request received', {
            questionId: req.params.id,
            updateData: req.body,
        });

        const question = await QuestionService.update(req.params.id, req.body);
        logger.info('Question updated successfully', {
            questionId: question._id,
            type: question.type,
        });

        res.status(200).json({ message: 'Question updated', question });
    } catch (error) {
        next(error);
    }
};

exports.deleteQuestion = async (req, res, next) => {
    try {
        logger.info('Delete question request received', {
            questionId: req.params.id,
        });

        await QuestionService.delete(req.params.id);
        logger.info('Question deleted successfully', {
            questionId: req.params.id,
        });

        res.status(200).json({ message: 'Question deleted' });
    } catch (error) {
        next(error);
    }
};
