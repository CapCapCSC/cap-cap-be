const Restaurant = require('../models/restaurant');

exports.create = async (data) => {
    return await Restaurant.create(data);
};

exports.getAll = async (query) => {
    const { page = 1, limit = 10, tags } = query;
    const filter = tags ? { tags: { $in: tags.split(',') } } : {};
    const Restaurants = await Restaurant.find(filter)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
    const total = await Restaurant.countDocuments(filter);
    return { data: Restaurants, pagination: { page, limit, total } };
};

exports.getById = async (id) => {
    return await Restaurant.findById(id);
};

exports.update = async (id, data) => {
    return await Restaurant.findByIdAndUpdate(id, data, { new: true });
};

exports.delete = async (id) => {
    const result = await Restaurant.findByIdAndDelete(id);
    return !!result;
};
