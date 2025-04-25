const mongoose = require('mongoose');
const User = require('../models/user');
const Quiz = require('../models/quiz');
const Question = require('../models/question');
const Badge = require('../models/badge');
const QuizResult = require('../models/quizResult');
const questions = require('./seed-data/questions.json');
const quizzes = require('./seed-data/quizzes.json');
const badges = require('./seed-data/Badge.json');
const quizResults = require('./seed-data/quizResults.json');

require('dotenv').config();

async function seedData() {
    try {
        // Kết nối database
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Xóa dữ liệu cũ
        await Promise.all([
            Quiz.deleteMany({}),
            Question.deleteMany({}),
            Badge.deleteMany({}),
            QuizResult.deleteMany({}),
        ]);
        console.log('Cleaned old data');

        // Seed badges
        const createdBadges = await Badge.create(badges);
        console.log('Seeded badges');

        // Seed questions
        const createdQuestions = await Question.create(questions);
        console.log('Seeded questions');

        // Seed quizzes with questions
        const quizzesWithQuestions = quizzes.map((quiz) => ({
            ...quiz,
            questions: createdQuestions.map((q) => q._id),
            rewardBadge: createdBadges[0]._id, // Gán badge đầu tiên làm phần thưởng
        }));
        const createdQuizzes = await Quiz.create(quizzesWithQuestions);
        console.log('Seeded quizzes');

        // Seed quiz results
        const quizResultsWithReferences = quizResults.map((result) => ({
            ...result,
            userId: result.userId, // Giữ nguyên userId vì đã được seed từ seed-user-hash.js
            quizId: createdQuizzes.find((q) => q._id.toString() === result.quizId)?._id,
            answers: result.answers.map((answer) => ({
                ...answer,
                questionId: createdQuestions.find((q) => q._id.toString() === answer.questionId)?._id,
            })),
            startedAt: new Date(result.startedAt),
            completedAt: new Date(result.completedAt),
        }));

        await QuizResult.create(quizResultsWithReferences);
        console.log('Seeded quiz results');

        console.log('Seeding completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}

seedData();
