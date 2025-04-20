const Question = require('../models/question');

exports.create = async (data) => {
    return await Question.create(data);
};

exports.getAll = async (query) => {
    const { page = 1, limit = 10, tags } = query;
    const filter = tags ? { tags: { $in: tags.split(',') } } : {};
    const questions = await Question.find(filter)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
    const total = await Question.countDocuments(filter);
    return { data: questions, pagination: { page, limit, total } };
};

exports.getById = async (id) => {
    return await Question.findById(id);
};

exports.update = async (id, data) => {
    return await Question.findByIdAndUpdate(id, data, { new: true });
};

exports.delete = async (id) => {
    const result = await Question.findByIdAndDelete(id);
    return !!result;
};
