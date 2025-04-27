const request = require('supertest');
const mongoose = require('mongoose');
const Quiz = require('../models/quiz');
const QuizResult = require('../models/quizResult');
const User = require('../models/user');
const Badge = require('../models/badge');
const Voucher = require('../models/voucher');
const Question = require('../models/question');
const Food = require('../models/food');
const Restaurant = require('../models/restaurant');
const db = require('../config/db');
const userService = require('../services/userService');

// Import app after database connection
const app = require('../src/index');

// Increase timeout for all tests
jest.setTimeout(30000);

describe('Quiz Functionality Test', () => {
    let testUser;
    let testQuiz;
    let testBadge;
    let testVoucher;
    let testFood;
    let testQuestions = [];
    let token;
    let uniqueEmail;

    beforeAll(async () => {
        try {
            // Connect to test database
            await db.connect();

            // Generate unique email
            uniqueEmail = `testuser_${Date.now()}@example.com`;

            // Create test user first using userService
            testUser = await userService.create({
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

            // Create test restaurant
            const testRestaurant = await Restaurant.create({
                name: 'Test Restaurant',
                address: '123 Test Street',
                phone: '0123456789',
                email: 'test@restaurant.com',
                description: 'A test restaurant',
                imageUrl: 'https://example.com/restaurant.jpg',
                openingHours: {
                    monday: { open: '09:00', close: '22:00' },
                    tuesday: { open: '09:00', close: '22:00' },
                    wednesday: { open: '09:00', close: '22:00' },
                    thursday: { open: '09:00', close: '22:00' },
                    friday: { open: '09:00', close: '22:00' },
                    saturday: { open: '09:00', close: '22:00' },
                    sunday: { open: '09:00', close: '22:00' },
                },
            });

            // Create test food
            testFood = await Food.create({
                name: 'Test Food',
                description: 'A test food item',
                price: 10,
                restaurant: testRestaurant._id,
                tags: [],
                imageUrl: 'https://example.com/food.jpg',
            });

            // Create test questions
            const question1 = await Question.create({
                content: 'What is the capital of France?',
                correctAnswer: ['Paris'],
                incorrectAnswer: ['London', 'Berlin', 'Madrid'],
                relatedFood: testFood._id,
            });
            testQuestions.push(question1);

            const question2 = await Question.create({
                content: 'Which of these are fruits?',
                correctAnswer: ['Apple', 'Banana'],
                incorrectAnswer: ['Carrot', 'Potato'],
                relatedFood: testFood._id,
            });
            testQuestions.push(question2);

            // Create test quiz
            testQuiz = await Quiz.create({
                name: 'Test Quiz',
                description: 'A test quiz',
                questions: testQuestions.map((q) => q._id),
                timeLimit: 30,
                passingScore: 70,
                rewardBadge: testBadge._id,
                rewardVoucher: testVoucher._id,
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
            await Food.deleteMany({});
            await Question.deleteMany({});
            await Restaurant.deleteMany({});
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
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.quiz).toBeDefined();
            expect(res.body.quizResult).toBeDefined();
            quizResult = res.body.quizResult;
        });

        test('should submit quiz with high score and get rewards', async () => {
            const answers = [
                {
                    questionId: testQuestions[0]._id.toString(),
                    selectedAnswer: 'Paris',
                    timeSpent: 10,
                },
                {
                    questionId: testQuestions[1]._id.toString(),
                    selectedAnswer: 'Apple',
                    timeSpent: 10,
                },
            ];

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
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBeGreaterThan(0);
        });

        test('should get quiz statistics', async () => {
            const res = await request(app).get('/api/quiz-results/statistics').set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.totalQuizzes).toBeGreaterThan(0);
            expect(typeof res.body.data.averageScore).toBe('number');
            expect(typeof res.body.data.rewardsEarned).toBe('number');
        });
    });
});
