const VoucherService = require('../services/voucherService');

exports.createVoucher = async (req, res) => {
    try {
        const voucher = await VoucherService.create(req.body);
        res.status(201).json({ message: 'Voucher created', voucher });
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};

exports.getVoucherById = async (req, res) => {
    try {
        const voucher = await VoucherService.getById(req.params.id);
        if (!voucher) return res.status(404).json({ error: 'NotFound', message: 'Voucher not found' });
        res.status(200).json(voucher);
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};

exports.updateVoucher = async (req, res) => {
    try {
        const voucher = await VoucherService.update(req.params.id, req.body);
        if (!voucher) return res.status(404).json({ error: 'NotFound', message: 'Voucher not found' });
        res.status(200).json({ message: 'Voucher updated', Voucher });
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};

exports.deleteVoucher = async (req, res) => {
    try {
        const success = await VoucherService.delete(req.params.id);
        if (!success) return res.status(404).json({ error: 'NotFound', message: 'Voucher not found' });
        res.status(200).json({ message: 'Voucher deleted' });
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};
