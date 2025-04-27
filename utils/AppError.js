class AppError extends Error {
    constructor(message, status, name = 'AppError', details = {}) {
        super(message);
        this.status = status;
        this.name = name;
        this.details = details;
        this.isOperational = true; 

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError; 