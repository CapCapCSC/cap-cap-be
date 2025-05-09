const mongoose = require('mongoose');
const schema = mongoose.Schema;

const question = new schema(
    {
        content: { type: String, required: true },
        correctAnswer: [{ type: String, required: true }],
        incorrectAnswer: [{ type: String, required: true }],
        relatedFood: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
    },
    { timestamps: true },
);

module.exports = mongoose.model('Question', question);
