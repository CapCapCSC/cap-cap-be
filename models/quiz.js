const mongoose = require('mongoose');
const schema = mongoose.Schema;

const quiz = new schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        imageUrl: { type: String },
        questions: [{ type: schema.Types.ObjectId, ref: 'Question', required: true }],
        dateCreated: { type: Date, default: Date.now },
        validUntil: { type: Date },
    },
    { timestamps: true },
);

module.exports = mongoose.model('Quiz', quiz);
