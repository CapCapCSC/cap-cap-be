const mongoose = require('mongoose');
const Quiz = require('../models/quiz');
const Question = require('../models/question');
const Badge = require('../models/badge');
const Restaurant = require('../models/restaurant');
const Voucher = require('../models/voucher');
const Food = require('../models/food');
const FoodTag = require('../models/foodTag');
const QuizResult = require('../models/quizResult');
const { createGoogleMapsLink } = require('../utils/googleMaps');

const questions = require('./seed-data/Question.json');
const quizzes = require('./seed-data/Quiz.json');
const badges = require('./seed-data/Badge.json');
const restaurants = require('./seed-data/Restaurant.json');
const vouchers = require('./seed-data/Voucher.json');
const foods = require('./seed-data/Food.json');
const foodTags = require('./seed-data/FoodTag.json');
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
            Restaurant.deleteMany({}),
            Voucher.deleteMany({}),
            Food.deleteMany({}),
            FoodTag.deleteMany({}),
        ]);
        console.log('Cleaned old data');

        // Seed badges
        const createdBadges = await Badge.create(badges);
        console.log('Seeded badges');

        // Seed food tags
        const createdFoodTags = await FoodTag.create(foodTags);
        console.log('Seeded food tags');

        // Seed foods
        const createdFoods = await Food.create(foods);
        console.log('Seeded foods');

        // Seed restaurants with auto-generated locationUrl
        const restaurantsWithLocation = await Promise.all(
            restaurants.map(async (restaurant) => ({
                ...restaurant,
                locationUrl: await createGoogleMapsLink(restaurant.address),
            })),
        );
        const createdRestaurants = await Restaurant.create(restaurantsWithLocation);
        console.log('Seeded restaurants');

        // Seed vouchers
        const createdVouchers = await Voucher.create(vouchers);
        console.log('Seeded vouchers');

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
