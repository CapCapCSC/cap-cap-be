const QuizResult = require('../models/quizResult');
const User = require('../models/user');
const Quiz = require('../models/quiz');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');
const Badge = require('../models/badge');
const Voucher = require('../models/voucher');

const QuizResultService = {
    calculateScore: async (quizId, answers) => {
        try {
            logger.info('Calculating quiz score', { quizId });

            const quiz = await Quiz.findById(quizId).populate('questions');
            if (!quiz) {
                throw new AppError('Quiz not found', 404, 'NotFound');
            }

            let correctAnswers = 0;
            const answerDetails = answers.map((answer) => {
                const question = quiz.questions.find((q) => q._id.toString() === answer.questionId);
                if (!question) {
                    throw new AppError(`Question ${answer.questionId} not found`, 400, 'InvalidQuestion');
                }

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
            const isHighScore = score >= quiz.passingScore;

            return {
                score,
                correctAnswers,
                totalQuestions: quiz.questions.length,
                isHighScore,
                answerDetails,
            };
        } catch (error) {
            logger.error('Error calculating score', {
                error: error.message,
                quizId,
            });
            throw error;
        }
    },

    create: async (data) => {
        try {
            logger.info('Creating quiz result', {
                userId: data.userId,
                quizId: data.quizId,
            });

            // Validate required fields
            const requiredFields = [
                'userId',
                'quizId',
                'answers',
                'score',
                'correctAnswers',
                'totalQuestions',
                'timeSpent',
                'status',
            ];
            for (const field of requiredFields) {
                if (!data[field]) {
                    throw new AppError(`Missing required field: ${field}`, 400, 'ValidationError');
                }
            }

            // Create quiz result
            const quizResult = new QuizResult({
                userId: data.userId,
                quizId: data.quizId,
                answers: data.answers,
                score: data.score,
                correctAnswers: data.correctAnswers,
                totalQuestions: data.totalQuestions,
                timeSpent: data.timeSpent,
                status: data.status,
                startTime: data.startTime,
                completedAt: data.completedAt,
            });

            await quizResult.save();

            logger.info('Quiz result created successfully', {
                resultId: quizResult._id,
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
    },

    awardRewards: async (userId, quiz, quizResult) => {
        try {
            logger.info('Awarding rewards', {
                userId,
                quizId: quiz._id,
                score: quizResult.score,
            });

            const rewards = {};
            const user = await User.findById(userId);

            if (!user) {
                throw new Error('User not found');
            }

            // Award badge if available
            if (quiz.rewardBadge) {
                const badge = await Badge.findById(quiz.rewardBadge);
                if (badge) {
                    rewards.badge = badge;
                    user.badges.push(badge._id);
                    await user.save();
                    logger.info('Badge awarded', {
                        userId,
                        badgeId: badge._id,
                    });
                }
            }

            // Award voucher if available
            if (quiz.rewardVoucher) {
                const voucher = await Voucher.findById(quiz.rewardVoucher);
                if (voucher) {
                    rewards.voucher = voucher;
                    user.vouchers.push(voucher._id);
                    await user.save();
                    logger.info('Voucher awarded', {
                        userId,
                        voucherId: voucher._id,
                    });
                }
            }

            // Update quiz result with rewards
            quizResult.rewards = rewards;
            await quizResult.save();

            return rewards;
        } catch (error) {
            logger.error('Error awarding rewards', {
                error: error.message,
                userId,
                quizId: quiz._id,
            });
            throw error;
        }
    },

    getById: async (id) => {
        try {
            logger.info('Getting quiz result by ID', { quizResultId: id });

            const quizResult = await QuizResult.findById(id);

            if (!quizResult) {
                logger.warn('Quiz result not found', { quizResultId: id });
                throw new AppError('Quiz result not found', 404, 'NotFound');
            }

            logger.info('Quiz result fetched successfully', { quizResultId: id });
            return quizResult;
        } catch (error) {
            logger.error('Error getting quiz result', {
                error: error.message,
                quizResultId: id,
            });
            throw error;
        }
    },

    getByUserId: async (userId, query = {}) => {
        try {
            logger.info('Getting quiz results by user ID', { userId });

            const page = parseInt(query.page) || 1;
            const limit = parseInt(query.limit) || 10;
            const skip = (page - 1) * limit;

            const [results, total] = await Promise.all([
                QuizResult.find({ userId }).sort({ submittedAt: -1 }).skip(skip).limit(limit),
                QuizResult.countDocuments({ userId }),
            ]);

            logger.info('Quiz results fetched successfully', {
                userId,
                count: results.length,
                total,
            });

            return {
                data: results,
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            logger.error('Error getting quiz results by user ID', {
                error: error.message,
                userId,
            });
            throw error;
        }
    },

    update: async (id, data) => {
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
    },

    getStatistics: async (userId) => {
        try {
            logger.info('Getting user statistics', { userId });

            const results = await QuizResult.find({
                userId,
                status: 'completed',
            });

            if (!results || results.length === 0) {
                return {
                    totalQuizzes: 0,
                    averageScore: 0,
                    timeSpent: 0,
                    completionRate: 0,
                    highScoreRate: 0,
                    timeEfficiency: 0,
                    rewardsEarned: 0,
                };
            }

            const totalQuizzes = results.length;
            const totalScore = results.reduce((sum, result) => sum + result.score, 0);
            const averageScore = totalScore / totalQuizzes;
            const totalTimeSpent = results.reduce((sum, result) => sum + (result.timeSpent || 0), 0);
            const completedQuizzes = results.length;
            const highScoreQuizzes = results.filter((result) => result.score >= 80).length;
            const rewardsEarned = results.filter(
                (result) => result.rewards && Object.keys(result.rewards).length > 0,
            ).length;

            const statistics = {
                totalQuizzes,
                averageScore: Math.round(averageScore * 100) / 100,
                timeSpent: Math.round(totalTimeSpent / 60), // Convert to minutes
                completionRate: 100, // Since we only count completed quizzes
                highScoreRate: Math.round((highScoreQuizzes / totalQuizzes) * 100),
                timeEfficiency: Math.round((averageScore / (totalTimeSpent / 60)) * 100) / 100,
                rewardsEarned,
            };

            logger.info('Statistics calculated', {
                userId,
                statistics,
            });

            return statistics;
        } catch (error) {
            logger.error('Error getting statistics', {
                error: error.message,
                userId,
            });
            throw error;
        }
    },
};

module.exports = QuizResultService;
