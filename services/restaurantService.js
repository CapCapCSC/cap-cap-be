const Restaurant = require('../models/restaurant');

exports.create = async (data) => {
    return await Restaurant.create(data);
};

exports.getAll = async (query) => {
    const { page = 1, limit = 10, tags } = query;
    const filter = tags ? { tags: { $in: tags.split(',') } } : {};
    const restaurants = await Restaurant.find(filter)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
    const total = await Restaurant.countDocuments(filter);
    return { data: restaurants, pagination: { page, limit, total } };
};

exports.getById = async (id) => {
    return await Restaurant.findById(id);
};

exports.getRandom3 = async (filters) => {
    const matchStage = {};

    if (filters.district) {
        matchStage.district = filters.district;
    }

    const restaurants = await Restaurant.aggregate([
        { $match: { matchStage } },
        { $sample: { size: 3 } }
    ]);
    if (!restaurants || restaurants.length === 0) {
        return [];
    }
    return restaurants;
};

exports.update = async (id, data) => {
    return await Restaurant.findByIdAndUpdate(id, data, { new: true });
};

exports.delete = async (id) => {
    const result = await Restaurant.findByIdAndDelete(id);
    return !!result;
};
