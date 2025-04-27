const mongoose = require('mongoose');
const schema = mongoose.Schema;

const quiz = new schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        imageUrl: { type: String },
        questions: {
            type: [
                {
                    type: schema.Types.ObjectId,
                    ref: 'Question',
                },
            ],
            required: true,
            validate: {
                validator: function (v) {
                    return v && v.length > 0;
                },
                message: 'Quiz must have at least one question',
            },
        },
        dateCreated: { type: Date, default: Date.now },
        validUntil: {
            type: Date,
            validate: {
                validator: function (v) {
                    return v > this.dateCreated;
                },
                message: 'Valid until date must be after creation date',
            },
        },
        timeLimit: { type: Number, required: true, min: 1, max: 120 },
        passingScore: { type: Number, required: true, min: 0, max: 100, default: 60 },
        rewardBadge: { type: schema.Types.ObjectId, ref: 'Badge' },
        rewardVoucher: { type: schema.Types.ObjectId, ref: 'Voucher' },
        isActive: { type: Boolean, default: true },
        statistics: {
            totalAttempts: { type: Number, default: 0 },
            averageScore: { type: Number, default: 0 },
            completionRate: { type: Number, default: 0 },
            averageTimeSpent: { type: Number, default: 0 },
        },
    },
    { timestamps: true },
);

quiz.virtual('questionCount').get(function () {
    return this.questions.length;
});

quiz.virtual('isAvailable').get(function () {
    const now = new Date();
    return this.isActive && this.questions.length > 0 && (!this.validUntil || this.validUntil > now);
});

quiz.index({ isActive: 1 });
quiz.index({ name: 'text', description: 'text' });

quiz.pre('save', function (next) {
    if (this.isModified('questions')) {
        this.statistics.totalAttempts = 0;
        this.statistics.averageScore = 0;
        this.statistics.completionRate = 0;
        this.statistics.averageTimeSpent = 0;
    }
    next();
});

module.exports = mongoose.model('Quiz', quiz);
