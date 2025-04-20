const QuizService = require('../services/quizService');

// ...existing code...
exports.createQuiz = async (req, res) => {
    try {
        const Quiz = await QuizService.create(req.body);
        res.status(201).json({ message: 'Quiz created', Quiz });
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};

exports.getAllQuizzes = async (req, res) => {
    try {
        const Quizzes = await QuizService.getAll(req.query);
        res.status(200).json(Quizzes);
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};

exports.getQuizById = async (req, res) => {
    try {
        const Quiz = await QuizService.getById(req.params.id);
        if (!Quiz) return res.status(404).json({ error: 'NotFound', message: 'Quiz not found' });
        res.status(200).json(Quiz);
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};

exports.updateQuiz = async (req, res) => {
    try {
        const Quiz = await QuizService.update(req.params.id, req.body);
        if (!Quiz) return res.status(404).json({ error: 'NotFound', message: 'Quiz not found' });
        res.status(200).json({ message: 'Quiz updated', Quiz });
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};

exports.deleteQuiz = async (req, res) => {
    try {
        const success = await QuizService.delete(req.params.id);
        if (!success) return res.status(404).json({ error: 'NotFound', message: 'Quiz not found' });
        res.status(200).json({ message: 'Quiz deleted' });
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};
// ...existing code...
