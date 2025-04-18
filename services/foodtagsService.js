const FoodTag = require('../models/foodtags');

exports.create = async (data) => {
    return await FoodTag.create(data);
};

exports.getAll = async () => {
    return await FoodTag.find();
};

exports.getById = async (id) => {
    return await FoodTag.findById(id);
};

exports.update = async (id, data) => {
    return await FoodTag.findByIdAndUpdate(id, data, { new: true });
};

exports.delete = async (id) => {
    const result = await FoodTag.findByIdAndDelete(id);
    return !!result;
};
