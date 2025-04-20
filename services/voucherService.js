const Voucher = require('../models/voucher');

exports.create = async (data) => {
    return await Voucher.create(data);
};

exports.getAll = async (query) => {
    const { page = 1, limit = 10, tags } = query;
    const filter = tags ? { tags: { $in: tags.split(',') } } : {};
    const vouchers = await Voucher.find(filter)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
    const total = await Voucher.countDocuments(filter);
    return { data: vouchers, pagination: { page, limit, total } };
};

exports.getById = async (id) => {
    return await Voucher.findById(id);
};

exports.update = async (id, data) => {
    return await Voucher.findByIdAndUpdate(id, data, { new: true });
};

exports.delete = async (id) => {
    const result = await Voucher.findByIdAndDelete(id);
    return !!result;
};
