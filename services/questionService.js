const Question = require('../models/question');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

exports.create = async (data) => {
    try {
        logger.info('Creating new question', {
            content: data.content,
            type: data.type,
        });

        const question = await Question.create(data);
        logger.info('Question created successfully', {
            questionId: question._id,
            type: question.type,
        });

        return question;
    } catch (error) {
        logger.error('Error creating question', {
            error: error.message,
            type: data.type,
        });
        throw error;
    }
};

exports.getAll = async (query) => {
    try {
        const { page = 1, limit = 10, tags } = query;
        const filter = tags ? { tags: { $in: tags.split(',') } } : {};

        logger.info('Fetching questions', {
            page,
            limit,
            tags: tags ? tags.split(',') : 'all',
        });

        const questions = await Question.find(filter)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Question.countDocuments(filter);

        logger.info('Questions fetched successfully', {
            count: questions.length,
            total,
            page,
            limit,
        });

        return { data: questions, pagination: { page, limit, total } };
    } catch (error) {
        logger.error('Error fetching questions', {
            error: error.message,
            query,
        });
        throw error;
    }
};

exports.getById = async (id) => {
    try {
        logger.info('Fetching question by ID', { questionId: id });

        const question = await Question.findById(id);
        if (!question) {
            logger.warn('Question not found', { questionId: id });
            throw new AppError('Question not found', 404, 'NotFound');
        }

        logger.info('Question fetched successfully', {
            questionId: question._id,
            type: question.type,
        });

        return question;
    } catch (error) {
        logger.error('Error fetching question', {
            error: error.message,
            questionId: id,
        });
        throw error;
    }
};

exports.update = async (id, data) => {
    try {
        logger.info('Updating question', {
            questionId: id,
            updateData: data,
        });

        const question = await Question.findByIdAndUpdate(id, data, { new: true });
        if (!question) {
            logger.warn('Question not found for update', { questionId: id });
            throw new AppError('Question not found', 404, 'NotFound');
        }

        logger.info('Question updated successfully', {
            questionId: question._id,
            type: question.type,
        });

        return question;
    } catch (error) {
        logger.error('Error updating question', {
            error: error.message,
            questionId: id,
        });
        throw error;
    }
};

exports.delete = async (id) => {
    try {
        logger.info('Deleting question', { questionId: id });

        const result = await Question.findByIdAndDelete(id);
        if (!result) {
            logger.warn('Question not found for deletion', { questionId: id });
            throw new AppError('Question not found', 404, 'NotFound');
        }

        logger.info('Question deleted successfully', { questionId: id });
        return true;
    } catch (error) {
        logger.error('Error deleting question', {
            error: error.message,
            questionId: id,
        });
        throw error;
    }
};
