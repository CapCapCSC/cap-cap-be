const quizResult = require('../models/quizResult');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

exports.create = async (data) => {
    try {
        logger.info('Creating new quiz result', {
            userId: data.userId,
            quizId: data.quizId,
            startedAt: data.startedAt,
        });

        const result = await quizResult.create(data);

        logger.info('Quiz result created successfully', {
            quizResultId: result._id,
            userId: result.userId,
            quizId: result.quizId,
        });

        return result;
    } catch (error) {
        logger.error('Error creating quiz result', {
            error: error.message,
            userId: data.userId,
            quizId: data.quizId,
        });
        throw error;
    }
};

exports.updateWhenSubmitted = async (id, data) => {
    try {
        logger.info('Updating quiz result on submission', {
            quizResultId: id,
            score: data.score,
            submittedAt: data.submittedAt,
        });

        const result = await quizResult.findByIdAndUpdate(id, data, { new: true });
        if (!result) {
            logger.warn('Quiz result not found for update', { quizResultId: id });
            throw new AppError('Quiz result not found', 404, 'NotFound');
        }

        logger.info('Quiz result updated successfully', {
            quizResultId: result._id,
            score: result.score,
            userId: result.userId,
        });

        return result;
    } catch (error) {
        logger.error('Error updating quiz result', {
            error: error.message,
            quizResultId: id,
        });
        throw error;
    }
};

exports.getById = async (id) => {
    try {
        logger.info('Fetching quiz result by ID', { quizResultId: id });

        const result = await quizResult.findById(id);
        if (!result) {
            logger.warn('Quiz result not found', { quizResultId: id });
            throw new AppError('Quiz result not found', 404, 'NotFound');
        }

        logger.info('Quiz result fetched successfully', {
            quizResultId: result._id,
            userId: result.userId,
            score: result.score,
        });

        return result;
    } catch (error) {
        logger.error('Error fetching quiz result', {
            error: error.message,
            quizResultId: id,
        });
        throw error;
    }
};

exports.getByUserId = async (userId) => {
    try {
        logger.info('Fetching quiz results by user ID', { userId });

        const results = await quizResult.find({ userId }).sort({ submittedAt: -1 });

        logger.info('Quiz results fetched successfully', {
            userId,
            count: results.length,
        });

        return results;
    } catch (error) {
        logger.error('Error fetching quiz results by user', {
            error: error.message,
            userId,
        });
        throw error;
    }
};
