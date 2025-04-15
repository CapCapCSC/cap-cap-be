const mongoose = require('mongoose');
const schema = mongoose.Schema;

const quiz = new schema(
    {
        name: {type: String},
        questions: [{type: schema.Types.ObjectId, ref: 'Questions'}],
        dateCreated: {type: Date, default: Date.now},
        dateAvailible: [{type: Date}],
    },
    { timestamps: true },
);

module.exports = mongoose.model('Quiz', quiz);
