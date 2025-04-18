const User = require('../models/user'); // Assuming a Mongoose model

exports.create = async (data) => {
    return await User.create(data);
};

exports.getById = async (id) => {
    return await User.findById(id).select('username vouchers badges');
};

exports.update = async (id, data) => {
    return await User.findByIdAndUpdate(id, data, { new: true });
};

exports.delete = async (id) => {
    const result = await User.findByIdAndDelete(id);
    return !!result;
};
