class ApiError extends Error {
    constructor(status, message, name = 'ApiError') {
        super(message);
        this.status = status;
        this.name = name;
    }
}

module.exports = ApiError;
