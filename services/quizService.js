const Quiz = require('../models/quiz');
const QuizResultService = require('../services/quizResultService');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');
const mongoose = require('mongoose');

exports.create = async (data) => {
    try {
        logger.info('Creating new quiz', {
            name: data.name,
            description: data.description,
            questionCount: data.questions?.length || 0,
        });

        const quiz = await Quiz.create(data);
        logger.info('Quiz created successfully', {
            quizId: quiz._id,
            name: quiz.name,
        });

        return quiz;
    } catch (error) {
        logger.error('Error creating quiz', {
            error: error.message,
            name: data.name,
        });
        throw error;
    }
};

exports.getAll = async (query) => {
    try {
        const { page = 1, limit = 10, search, isActive } = query;
        const filter = {};

        if (search) {
            filter.$text = { $search: search };
        }
        if (isActive !== undefined) {
            filter.isActive = isActive === 'true';
        }

        logger.info('Fetching quizzes', {
            page,
            limit,
            search,
            isActive,
        });

        const quizzes = await Quiz.find(filter)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });
        const total = await Quiz.countDocuments(filter);

        logger.info('Quizzes fetched successfully', {
            count: quizzes.length,
            total,
            page,
            limit,
        });

        return { data: quizzes, pagination: { page, limit, total } };
    } catch (error) {
        logger.error('Error fetching quizzes', {
            error: error.message,
            query,
        });
        throw error;
    }
};

exports.getById = async (id) => {
    try {
        logger.info('Fetching quiz by ID', { quizId: id });

        const quiz = await Quiz.findById(id).populate('questions');
        if (!quiz) {
            logger.warn('Quiz not found', { quizId: id });
            throw new AppError('Quiz not found', 404, 'NotFound');
        }

        logger.info('Quiz fetched successfully', {
            quizId: quiz._id,
            name: quiz.name,
            questionCount: quiz.questions.length,
        });

        return quiz;
    } catch (error) {
        logger.error('Error fetching quiz', {
            error: error.message,
            quizId: id,
        });
        throw error;
    }
};

exports.update = async (id, data) => {
    try {
        logger.info('Updating quiz', {
            quizId: id,
            updateData: data,
        });

        const quiz = await Quiz.findByIdAndUpdate(id, data, { new: true });
        if (!quiz) {
            logger.warn('Quiz not found for update', { quizId: id });
            throw new AppError('Quiz not found', 404, 'NotFound');
        }

        logger.info('Quiz updated successfully', {
            quizId: quiz._id,
            name: quiz.name,
        });

        return quiz;
    } catch (error) {
        logger.error('Error updating quiz', {
            error: error.message,
            quizId: id,
        });
        throw error;
    }
};

exports.delete = async (id) => {
    try {
        logger.info('Deleting quiz', { quizId: id });

        const result = await Quiz.findByIdAndDelete(id);
        if (!result) {
            logger.warn('Quiz not found for deletion', { quizId: id });
            throw new AppError('Quiz not found', 404, 'NotFound');
        }

        logger.info('Quiz deleted successfully', { quizId: id });
        return true;
    } catch (error) {
        logger.error('Error deleting quiz', {
            error: error.message,
            quizId: id,
        });
        throw error;
    }
};

exports.startQuiz = async (quizId, userId) => {
    try {
        logger.info('Starting quiz', { quizId, userId });

        const quiz = await Quiz.findById(quizId).populate('questions');
        if (!quiz) {
            logger.warn('Quiz not found', { quizId });
            throw new AppError('Quiz not found', 404, 'NotFound');
        }

        // Create initial quiz result
        const quizResult = await QuizResultService.create({
            userId,
            quizId,
            score: 0,
            correctAnswers: 0,
            totalQuestions: quiz.questions.length,
            answers: [],
            startedAt: new Date(),
            completedAt: null,
            timeSpent: 0,
            status: 'in_progress',
        });

        logger.info('Quiz started successfully', {
            quizId,
            userId,
            quizResultId: quizResult._id,
        });

        return {
            quiz,
            quizResult,
        };
    } catch (error) {
        logger.error('Error starting quiz', {
            error: error.message,
            quizId,
            userId,
        });
        throw error;
    }
};

exports.submitQuiz = async (quizId, userId, answers) => {
    try {
        logger.info('Submitting quiz', { quizId, userId });

        const quiz = await Quiz.findById(quizId).populate('questions');
        if (!quiz) {
            throw new AppError('Quiz not found', 404);
        }

        // Find the in-progress quiz result
        const quizResult = await QuizResultService.findOne({
            quizId,
            userId,
            status: 'in_progress',
        }).sort({ startedAt: -1 });

        if (!quizResult) {
            throw new AppError('No active quiz session found', 400);
        }

        // Calculate time spent in seconds
        const completedAt = new Date();
        const timeSpent = Math.floor((completedAt - quizResult.startedAt) / 1000);

        // Calculate score
        let correctAnswers = 0;
        const answerDetails = answers.map((answer) => {
            const question = quiz.questions.find((q) => q._id.toString() === answer.questionId);
            const isCorrect = question.correctAnswer === answer.selectedAnswer;
            if (isCorrect) correctAnswers++;
            return {
                questionId: answer.questionId,
                selectedAnswer: answer.selectedAnswer,
                isCorrect,
                timeSpent: answer.timeSpent || 0,
            };
        });

        const score = (correctAnswers / quiz.questions.length) * 100;

        // Update quiz result
        const updatedQuizResult = await QuizResultService.update(quizResult._id, {
            score,
            correctAnswers,
            totalQuestions: quiz.questions.length,
            answers: answerDetails,
            completedAt,
            timeSpent,
            status: 'completed',
            rewards: {
                badge: score >= quiz.passingScore ? quiz.rewardBadge : null,
                voucher: score >= quiz.passingScore ? quiz.rewardVoucher : null,
            },
        });

        // Update quiz statistics
        await this.updateQuizStatistics(quizId, score, timeSpent);

        return updatedQuizResult;
    } catch (error) {
        logger.error('Error submitting quiz:', error);
        throw error;
    }
};

exports.updateQuizStatistics = async (quizId, score, timeSpent) => {
    try {
        await Quiz.findByIdAndUpdate(quizId, {
            $inc: {
                'statistics.totalAttempts': 1,
                'statistics.totalTimeSpent': timeSpent,
            },
            $set: {
                'statistics.averageScore': score,
                'statistics.averageTimeSpent': timeSpent,
                'statistics.completionRate': 100,
            },
        });
    } catch (error) {
        logger.error('Error updating quiz statistics', {
            error: error.message,
            quizId,
        });
        throw error;
    }
};

exports.getStatistics = async (quizId) => {
    try {
        const statistics = await QuizResultService.aggregate([
            {
                $match: {
                    quizId: new mongoose.Types.ObjectId(quizId),
                    status: 'completed',
                },
            },
            {
                $group: {
                    _id: null,
                    totalAttempts: { $sum: 1 },
                    averageScore: { $avg: '$score' },
                    highestScore: { $max: '$score' },
                    lowestScore: { $min: '$score' },
                    totalTimeSpent: { $sum: '$timeSpent' },
                    averageTimeSpent: { $avg: '$timeSpent' },
                    completionRate: {
                        $avg: {
                            $cond: [{ $eq: ['$status', 'completed'] }, 1, 0],
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalAttempts: 1,
                    averageScore: { $round: ['$averageScore', 2] },
                    highestScore: 1,
                    lowestScore: 1,
                    totalTimeSpent: 1,
                    averageTimeSpent: { $round: ['$averageTimeSpent', 2] },
                    completionRate: { $round: [{ $multiply: ['$completionRate', 100] }, 2] },
                },
            },
        ]);

        if (statistics.length === 0) {
            return {
                totalAttempts: 0,
                averageScore: 0,
                highestScore: 0,
                lowestScore: 0,
                totalTimeSpent: 0,
                averageTimeSpent: 0,
                completionRate: 0,
            };
        }

        return statistics[0];
    } catch (error) {
        logger.error('Error getting quiz statistics', {
            error: error.message,
            quizId,
        });
        throw error;
    }
};
