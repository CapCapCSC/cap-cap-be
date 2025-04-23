module.exports = (err, req, res, next) => {
    console.error('[ERROR]', err);

    const statusCode = err.status || 500;
    const response = {
        error: err.name || 'InternalServerError',
        message: err.message || 'Something went wrong',
    };

    res.status(statusCode).json(response);
};
