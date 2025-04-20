const Badge = require('../models/badge');

exports.create = async (data) => {
    return await Badge.create(data);
};

exports.getAll = async (query) => {
    const { page = 1, limit = 10, tags } = query;
    const filter = tags ? { tags: { $in: tags.split(',') } } : {};
    const badges = await Badge.find(filter)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
    const total = await Badge.countDocuments(filter);
    return { data: badges, pagination: { page, limit, total } };
};

exports.getById = async (id) => {
    return await Badge.findById(id);
};

exports.update = async (id, data) => {
    return await Badge.findByIdAndUpdate(id, data, { new: true });
};

exports.delete = async (id) => {
    const result = await Badge.findByIdAndDelete(id);
    return !!result;
};
