const User = require('../models/user');

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

exports.addBadge = async (userId, badgeId) => {
    const user = await User.findByIdAndUpdate(
        userId, 
        { $addToSet: { badges: badgeId } }, 
        { new: true }
    ).populate('badges');
    return user;
};

exports.addVoucher = async (userId, voucherId) => {
    const user = await User.findByIdAndUpdate(
        userId, 
        { $addToSet: { vouchers: voucherId } }, 
        { new: true }
    ).populate('vouchers');
    return user;
};
