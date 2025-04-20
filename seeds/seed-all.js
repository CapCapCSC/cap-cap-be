const { Seeder } = require('mongo-seeding');
const path = require('path');

const seeder = new Seeder({
    database: process.env.MONGODB_URI || 'mongodb://localhost:27017/capcap',
    dropDatabase: false,
});

const collections = [
    {
        name: 'foodtags',
        documents: require(path.join(__dirname, './seed-data/FoodTags.json')),
    },
    {
        name: 'food',
        documents: require(path.join(__dirname, './seed-data/Food.json')),
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
