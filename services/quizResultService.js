const quizResult = require('../models/quizResult');

exports.create = async (data) => {
    return await quizResult.create(data);
};

exports.updateWhenSubmitted = async (id, data) => {
    return await quizResult.findByIdAndUpdate(id, data, { new: true });
}