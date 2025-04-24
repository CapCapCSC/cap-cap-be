const mongoose = require('mongoose');
const schema = mongoose.Schema;

const quizResultSchema = new schema(
    {
        userId: { type: schema.Types.ObjectId, ref: 'User', required: true },
        quizId: { type: schema.Types.ObjectId, ref: 'Quiz', required: true },
        startedAt: { type: Date, default: Date.now },
        submittedAt: { type: Date, default: Date.now },
        score: { type: Number },
    },
    { timestamps: true },
);

module.exports = mongoose.model('QuizResult', quizResultSchema);