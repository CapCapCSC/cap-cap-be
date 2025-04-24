const QuizResult = require('../models/quizResult');
const User = require('../models/user');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

exports.calculateScore = async (quiz, answers) => {
    try {
        logger.info('Calculating quiz score', {
            quizId: quiz._id,
            answerCount: answers.length,
        });

        let correctAnswers = 0;
        const answerDetails = [];

        for (const answer of answers) {
            const question = quiz.questions.find((q) => q._id.toString() === answer.questionId);
            if (!question) {
                logger.warn('Question not found in quiz', {
                    questionId: answer.questionId,
                    quizId: quiz._id,
                });
                continue;
            }

            const isCorrect = question.correctAnswer === answer.selectedAnswer;
            if (isCorrect) correctAnswers++;

            answerDetails.push({
                questionId: question._id,
                selectedAnswer: answer.selectedAnswer,
                isCorrect,
                timeSpent: answer.timeSpent || 0,
            });
        }

        const score = (correctAnswers / quiz.questions.length) * 100;
        const isHighScore = score >= passingScore;

        logger.info('Score calculated', {
            quizId: quiz._id,
            score,
            correctAnswers,
            totalQuestions: quiz.questions.length,
            isHighScore,
        });

        return {
            score,
            correctAnswers,
            totalQuestions: quiz.questions.length,
            answerDetails,
            isHighScore,
        };
    } catch (error) {
        logger.error('Error calculating score', {
            error: error.message,
            quizId: quiz._id,
        });
        throw error;
    }
};

exports.create = async (data) => {
    try {
        logger.info('Creating quiz result', {
            userId: data.userId,
            quizId: data.quizId,
        });

        const quizResult = await QuizResult.create(data);
        logger.info('Quiz result created successfully', {
            quizResultId: quizResult._id,
            userId: data.userId,
            quizId: data.quizId,
        });

        return quizResult;
    } catch (error) {
        logger.error('Error creating quiz result', {
            error: error.message,
            userId: data.userId,
            quizId: data.quizId,
        });
        throw error;
    }
};

exports.awardRewards = async (userId, quiz, quizResult) => {
    try {
        if (!quizResult.isHighScore) {
            return null;
        }

        logger.info('Awarding rewards for high score', {
            userId,
            quizId: quiz._id,
            score: quizResult.score,
        });

        const rewards = {};

        // Award badge if available
        if (quiz.rewardBadge) {
            rewards.badge = quiz.rewardBadge;
            await User.findByIdAndUpdate(userId, {
                $addToSet: { badges: quiz.rewardBadge },
            });
            logger.info('Badge awarded', {
                userId,
                badgeId: quiz.rewardBadge,
            });
        }

        // Award voucher if available
        if (quiz.rewardVoucher) {
            rewards.voucher = quiz.rewardVoucher;
            await User.findByIdAndUpdate(userId, {
                $addToSet: { vouchers: quiz.rewardVoucher },
            });
            logger.info('Voucher awarded', {
                userId,
                voucherId: quiz.rewardVoucher,
            });
        }

        // Update rewards in quiz result
        if (Object.keys(rewards).length > 0) {
            await QuizResult.findByIdAndUpdate(quizResult._id, {
                rewards,
            });
        }

        return rewards;
    } catch (error) {
        logger.error('Error awarding rewards', {
            error: error.message,
            userId,
            quizId: quiz._id,
        });
        throw error;
    }
};

exports.getById = async (id) => {
    try {
        logger.info('Fetching quiz result by ID', { quizResultId: id });

        const quizResult = await QuizResult.findById(id)
            .populate('userId', 'name email')
            .populate('quizId', 'name timeLimit passingScore');
        if (!quizResult) {
            logger.warn('Quiz result not found', { quizResultId: id });
            throw new AppError('Quiz result not found', 404, 'NotFound');
        }

        logger.info('Quiz result fetched successfully', {
            quizResultId: quizResult._id,
            userId: quizResult.userId,
            quizId: quizResult.quizId,
        });

        return quizResult;
    } catch (error) {
        logger.error('Error fetching quiz result', {
            error: error.message,
            quizResultId: id,
        });
        throw error;
    }
};

exports.getByUserId = async (userId, query = {}) => {
    try {
        const { page = 1, limit = 10, status } = query;
        const filter = { userId };
        if (status) filter.status = status;

        logger.info('Fetching quiz results by user ID', {
            userId,
            page,
            limit,
            filter,
        });

        const results = await QuizResult.find(filter)
            .populate('quizId', 'name timeLimit passingScore')
            .sort({ completedAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        const total = await QuizResult.countDocuments(filter);

        logger.info('Quiz results fetched successfully', {
            userId,
            count: results.length,
            total,
            page,
            limit,
        });

        return { data: results, pagination: { page, limit, total } };
    } catch (error) {
        logger.error('Error fetching quiz results by user', {
            error: error.message,
            userId,
        });
        throw error;
    }
};

exports.update = async (id, data) => {
    try {
        logger.info('Updating quiz result', {
            quizResultId: id,
            updateData: data,
        });

        const quizResult = await QuizResult.findByIdAndUpdate(id, data, { new: true });
        if (!quizResult) {
            logger.warn('Quiz result not found for update', { quizResultId: id });
            throw new AppError('Quiz result not found', 404, 'NotFound');
        }

        logger.info('Quiz result updated successfully', {
            quizResultId: quizResult._id,
            userId: quizResult.userId,
            quizId: quizResult.quizId,
        });

        return quizResult;
    } catch (error) {
        logger.error('Error updating quiz result', {
            error: error.message,
            quizResultId: id,
        });
        throw error;
    }
};

exports.getStatistics = async (userId) => {
    try {
        logger.info('Getting user quiz statistics', { userId });

        const results = await QuizResult.find({ userId, status: 'completed' }).populate(
            'quizId',
            'name timeLimit passingScore',
        );

        if (results.length === 0) {
            logger.info('No quiz results found for user', { userId });
            return {
                totalQuizzes: 0,
                averageScore: 0,
                timeSpent: {
                    average: 0,
                    total: 0,
                },
                completionRate: 0,
                highScoreRate: 0,
            };
        }

        const statistics = {
            totalQuizzes: results.length,
            averageScore: results.reduce((acc, result) => acc + result.score, 0) / results.length,
            timeSpent: {
                average: results.reduce((acc, result) => acc + result.timeSpent, 0) / results.length,
                total: results.reduce((acc, result) => acc + result.timeSpent, 0),
            },
        };

        // Calculate completion rate
        const totalAttempts = await QuizResult.countDocuments({ userId });
        statistics.completionRate = (results.length / totalAttempts) * 100;

        // Calculate high score rate (score >= passingScore)
        const highScores = results.filter((result) => result.score >= result.quizId.passingScore).length;
        statistics.highScoreRate = (highScores / results.length) * 100;

        // Calculate time efficiency (time spent vs time limit)
        statistics.timeEfficiency =
            (results.reduce((acc, result) => {
                const efficiency = (result.quizId.timeLimit - result.timeSpent) / result.quizId.timeLimit;
                return acc + (efficiency > 0 ? efficiency : 0);
            }, 0) /
                results.length) *
            100;

        // Calculate rewards earned
        const rewardsEarned = results.filter((result) => result.rewards.badge || result.rewards.voucher).length;
        statistics.rewardsEarned = rewardsEarned;

        logger.info('User quiz statistics calculated successfully', {
            userId,
            statistics,
        });

        return statistics;
    } catch (error) {
        logger.error('Error calculating user statistics', {
            error: error.message,
            userId,
        });
        throw error;
    }
};
