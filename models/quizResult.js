const mongoose = require('mongoose');
const schema = mongoose.Schema;

const answerSchema = new schema({
    questionId: { type: schema.Types.ObjectId, ref: 'Question', required: true },
    selectedAnswer: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
    timeSpent: { type: Number, default: 0 },
});

const quizResultSchema = new schema(
    {
        userId: { type: schema.Types.ObjectId, ref: 'User', required: true },
        quizId: { type: schema.Types.ObjectId, ref: 'Quiz', required: true },
        score: { type: Number, required: true, min: 0, max: 100 },
        correctAnswers: { type: Number, required: true },
        totalQuestions: { type: Number, required: true },
        answers: [answerSchema],
        startedAt: { type: Date, required: true },
        completedAt: {
            type: Date,
            required: true,
            validate: {
                validator: function (v) {
                    return v > this.startedAt;
                },
                message: 'Completion time must be after start time',
            },
        },
        timeSpent: {
            type: Number,
            required: true,
            validate: {
                validator: async function (v) {
                    const quiz = await mongoose.model('Quiz').findById(this.quizId);
                    return v <= quiz.timeLimit * 60; // Convert minutes to seconds
                },
                message: 'Time spent must not exceed quiz time limit',
            },
        },
        status: {
            type: String,
            enum: ['in_progress', 'completed', 'abandoned'],
            default: 'in_progress',
        },
        rewards: {
            badge: { type: schema.Types.ObjectId, ref: 'Badge' },
            voucher: { type: schema.Types.ObjectId, ref: 'Voucher' },
        },
    },
    { timestamps: true },
);

quizResultSchema.virtual('percentageScore').get(function () {
    return (this.correctAnswers / this.totalQuestions) * 100;
});

quizResultSchema.index({ userId: 1, quizId: 1 });
quizResultSchema.index({ completedAt: -1 });
quizResultSchema.index({ score: -1 });
quizResultSchema.index({ status: 1 });

module.exports = mongoose.model('QuizResult', quizResultSchema);
