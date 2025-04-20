const { Seeder } = require('mongo-seeding');
const path = require('path');

const seeder = new Seeder({
    database: process.env.MONGODB_URI || 'mongodb://localhost:27017/capcap',
    dropDatabase: false,
});

const collections = [
    {
        name: 'foodtags',
        documents: require(path.join(__dirname, './seed-data/FoodTag.json')),
    },
    {
        name: 'foods',
        documents: require(path.join(__dirname, './seed-data/Food.json')),
    },
    {
        name: 'users',
        documents: require(path.join(__dirname, './seed-data/User.json')),
    },
    {
        name: 'restaurants',
        documents: require(path.join(__dirname, './seed-data/Restaurant.json')),
    },
    {
        name: 'vouchers',
        documents: require(path.join(__dirname, './seed-data/Voucher.json')),
    },
    {
        name: 'badges',
        documents: require(path.join(__dirname, './seed-data/Badge.json')),
    },
    {
        name: 'questions',
        documents: require(path.join(__dirname, './seed-data/Question.json')),
    },
    {
        name: 'quizzes',
        documents: require(path.join(__dirname, './seed-data/Quiz.json')),
    },
];

seeder
    .import(collections)
    .then(() => {
        console.log('Seeding all collections completed!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('Seeding failed:', err);
        process.exit(1);
    });
