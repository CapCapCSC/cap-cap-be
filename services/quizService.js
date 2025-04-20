const Quiz = require('../models/quiz');

exports.create = async (data) => {
    return await Quiz.create(data);
};

exports.getAll = async (query) => {
    const { page = 1, limit = 10, tags } = query;
    const filter = tags ? { tags: { $in: tags.split(',') } } : {};
    const quizzes = await Quiz.find(filter)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
    const total = await Quiz.countDocuments(filter);
    return { data: quizzes, pagination: { page, limit, total } };
};

exports.getById = async (id) => {
    return await Quiz.findById(id);
};

exports.update = async (id, data) => {
    return await Quiz.findByIdAndUpdate(id, data, { new: true });
};

exports.delete = async (id) => {
    const result = await Quiz.findByIdAndDelete(id);
    return !!result;
};
