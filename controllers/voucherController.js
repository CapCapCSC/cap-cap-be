const VoucherService = require('../services/voucherService');

// ...existing code...
exports.createVoucher = async (req, res) => {
    try {
        const Voucher = await VoucherService.create(req.body);
        res.status(201).json({ message: 'Voucher created', Voucher });
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};

exports.getVoucherById = async (req, res) => {
    try {
        const Voucher = await VoucherService.getById(req.params.id);
        if (!Voucher) return res.status(404).json({ error: 'NotFound', message: 'Voucher not found' });
        res.status(200).json(Voucher);
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};

exports.updateVoucher = async (req, res) => {
    try {
        const Voucher = await VoucherService.update(req.params.id, req.body);
        if (!Voucher) return res.status(404).json({ error: 'NotFound', message: 'Voucher not found' });
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
// ...existing code...
