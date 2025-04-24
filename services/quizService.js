const Quiz = require('../models/quiz');
const QuizResultService = require('../services/quizResultService');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

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

exports.startQuiz = async (id, userId) => {
    try {
        logger.info('Starting quiz', {
            quizId: id,
            userId,
        });

        const quiz = await Quiz.findById(id).populate('questions');
        if (!quiz) {
            logger.warn('Quiz not found for starting', { quizId: id });
            throw new AppError('Quiz not found', 404, 'NotFound');
        }

        if (!quiz.isAvailable) {
            logger.warn('Quiz is not available', {
                quizId: id,
                isActive: quiz.isActive,
                questionCount: quiz.questions.length,
                validUntil: quiz.validUntil,
            });
            throw new AppError('Quiz is not available', 400, 'NotAvailable');
        }

        const quizResult = await QuizResultService.create({
            userId,
            quizId: id,
            startedAt: new Date(),
            status: 'in_progress',
        });

        logger.info('Quiz started successfully', {
            quizId: id,
            userId,
            quizResultId: quizResult._id,
        });

        return { quiz, quizResult };
    } catch (error) {
        logger.error('Error starting quiz', {
            error: error.message,
            quizId: id,
            userId,
        });
        throw error;
    }
};

exports.submitQuiz = async (id, userId, answers, quizResultId) => {
    try {
        logger.info('Submitting quiz', {
            quizId: id,
            userId,
            quizResultId,
            answerCount: answers.length,
        });

        const quiz = await Quiz.findById(id).populate('questions');
        if (!quiz) {
            logger.warn('Quiz not found for submission', { quizId: id });
            throw new AppError('Quiz not found', 404, 'NotFound');
        }

        let score = 0;
        const total = quiz.questions.length;
        const completedAt = new Date();

        const answerDetails = quiz.questions.map((question) => {
            const userAnswer = answers.find((answer) => answer.questionId === question._id.toString());
            const isCorrect = userAnswer && question.correctAnswer === userAnswer.answer;
            if (isCorrect) score++;
            return {
                questionId: question._id,
                selectedAnswer: userAnswer?.answer || '',
                isCorrect,
                timeSpent: userAnswer?.timeSpent || 0,
            };
        });

        const percentageScore = (score / total) * 100;
        const timeSpent = Math.floor((completedAt - new Date(quizResultId.startedAt)) / 1000);

        const quizResult = await QuizResultService.update(quizResultId, {
            score: percentageScore,
            correctAnswers: score,
            totalQuestions: total,
            answers: answerDetails,
            completedAt,
            timeSpent,
            status: 'completed',
            rewards: {
                badge: percentageScore >= quiz.passingScore ? quiz.rewardBadge : null,
                voucher: percentageScore >= quiz.passingScore ? quiz.rewardVoucher : null,
            },
        });

        // Update quiz statistics
        const totalAttempts = quiz.statistics.totalAttempts + 1;
        const newAverageScore =
            (quiz.statistics.averageScore * quiz.statistics.totalAttempts + percentageScore) / totalAttempts;
        const newAverageTimeSpent =
            (quiz.statistics.averageTimeSpent * quiz.statistics.totalAttempts + timeSpent) / totalAttempts;

        await Quiz.findByIdAndUpdate(id, {
            $inc: { 'statistics.totalAttempts': 1 },
            $set: {
                'statistics.averageScore': newAverageScore,
                'statistics.averageTimeSpent': newAverageTimeSpent,
                'statistics.completionRate':
                    (quiz.statistics.completionRate * quiz.statistics.totalAttempts + 100) / totalAttempts,
            },
        });

        logger.info('Quiz submitted successfully', {
            quizId: id,
            userId,
            quizResultId: quizResult._id,
            score: percentageScore,
            timeSpent,
        });

        return quizResult;
    } catch (error) {
        logger.error('Error submitting quiz', {
            error: error.message,
            quizId: id,
            userId,
        });
        throw error;
    }
};
