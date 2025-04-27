const cors = require('cors');

const corsOptions = {
    origin: process.env.FRONTEND_URL , // URL của frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200,
};

module.exports = cors(corsOptions);
