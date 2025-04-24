const request = require('supertest');
const mongoose = require('mongoose');
const Quiz = require('../models/quiz');
const QuizResult = require('../models/quizResult');
const User = require('../models/user');
const Badge = require('../models/badge');
const Voucher = require('../models/voucher');
const Question = require('../models/question');
const db = require('../config/db');

// Import app after database connection
const app = require('../src/index');

// Increase timeout for all tests
jest.setTimeout(30000);

describe('Quiz Functionality Test', () => {
    let testUser;
    let testQuiz;
    let testBadge;
    let testVoucher;
    let testQuestions = [];
    let token;
    let uniqueEmail;

    beforeAll(async () => {
        try {
            // Connect to test database
            await db.connect();

            // Generate unique email
            uniqueEmail = `testuser_${Date.now()}@example.com`;

            // Create test user first
            testUser = await User.create({
                username: 'testuser',
                email: uniqueEmail,
                password: 'password123',
            });

            // Create test badge
            testBadge = await Badge.create({
                name: 'Test Badge',
                iconUrl: 'https://example.com/badge.png',
            });

            // Create test voucher
            testVoucher = await Voucher.create({
                name: 'Test Voucher',
                validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                applicableRestaurants: [],
                discountValue: 10,
            });

            // Create test questions
            for (let i = 0; i < 2; i++) {
                const question = await Question.create({
                    content: `Test Question ${i + 1}`,
                    options: ['A', 'B', 'C', 'D'],
                    correctAnswer: 'A',
                    relatedFood: null,
                });
                testQuestions.push(question);
            }

            // Create test quiz with questions
            testQuiz = await Quiz.create({
                name: 'Test Quiz',
                description: 'Test quiz functionality',
                questions: testQuestions.map((q) => q._id),
                timeLimit: 30,
                passingScore: 80,
                rewardBadge: testBadge._id,
                rewardVoucher: testVoucher._id,
                validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            });

            // Login to get token
            const loginRes = await request(app).post('/api/auth/login').send({
                email: uniqueEmail,
                password: 'password123',
            });

            if (!loginRes.body.accessToken) {
                throw new Error('Login failed: ' + JSON.stringify(loginRes.body));
            }

            token = loginRes.body.accessToken;
        } catch (error) {
            console.error('Error in beforeAll:', error);
            throw error;
        }
    });

    afterAll(async () => {
        try {
            // Cleanup
            await User.deleteMany({});
            await Quiz.deleteMany({});
            await QuizResult.deleteMany({});
            await Badge.deleteMany({});
            await Voucher.deleteMany({});
            await Question.deleteMany({});
            await mongoose.connection.close();
        } catch (error) {
            console.error('Error in afterAll:', error);
        }
    });

    describe('Quiz Flow Test', () => {
        let quizResult;

        test('should start a quiz', async () => {
            const res = await request(app)
                .post(`/api/quizzes/${testQuiz._id}/start`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    userId: testUser._id,
                });

            expect(res.status).toBe(200);
            expect(res.body.quiz).toBeDefined();
            expect(res.body.quizResult).toBeDefined();
            quizResult = res.body.quizResult;
        });

        test('should submit quiz with high score and get rewards', async () => {
            const answers = testQuestions.map((question) => ({
                questionId: question._id.toString(),
                selectedAnswer: 'A', // Correct answer
                timeSpent: 10,
            }));

            const res = await request(app).post('/api/quizzes/submit').set('Authorization', `Bearer ${token}`).send({
                quizId: testQuiz._id,
                answers,
                timeSpent: 20,
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.score).toBeGreaterThanOrEqual(80);
            expect(res.body.data.isHighScore).toBe(true);
            expect(res.body.data.rewards).toBeDefined();
            expect(res.body.data.rewards.badge).toBeDefined();
            expect(res.body.data.rewards.voucher).toBeDefined();
        });

        test('should verify rewards in user profile', async () => {
            const updatedUser = await User.findById(testUser._id).populate('badges').populate('vouchers');

            expect(updatedUser.badges).toContainEqual(
                expect.objectContaining({
                    _id: testBadge._id,
                }),
            );
            expect(updatedUser.vouchers).toContainEqual(
                expect.objectContaining({
                    _id: testVoucher._id,
                }),
            );
        });

        test('should get quiz history', async () => {
            const res = await request(app).get('/api/quiz-results/history').set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveLength(1);
            expect(res.body.data[0].score).toBeGreaterThanOrEqual(80);
        });

        test('should get quiz statistics', async () => {
            const res = await request(app).get('/api/quiz-results/statistics').set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.totalQuizzes).toBe(1);
            expect(res.body.data.averageScore).toBeGreaterThanOrEqual(80);
            expect(res.body.data.rewardsEarned).toBe(1);
        });
    });
});
