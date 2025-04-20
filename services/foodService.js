const Food = require('../models/food');

exports.create = async (data) => {
    return await Food.create(data);
};

exports.getAll = async (query) => {
    const { page = 1, limit = 10, tags } = query;
    const filter = tags ? { tags: { $in: tags.split(',') } } : {};
    const foods = await Food.find(filter)
        .populate('tags')
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
    const total = await Food.countDocuments(filter);
    return { data: foods, pagination: { page, limit, total } };
};

exports.getById = async (id) => {
    return await Food.findById(id).populate('tags');
};

exports.update = async (id, data) => {
    return await Food.findByIdAndUpdate(id, data, { new: true });
};

exports.delete = async (id) => {
    const result = await Food.findByIdAndDelete(id);
    return !!result;
};
