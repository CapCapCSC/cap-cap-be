const QuizResultService = require('../services/quizResultService');

exports.createQuizResult = async (req, res) => {
    try {
        const quizResult = await QuizResultService.create(req.body);
        res.status(201).json({ message: 'Quiz result created', quizResult });
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
}