const QuizService = require('../services/quizService');

exports.createQuiz = async (req, res) => {
    try {
        const quiz = await QuizService.create(req.body);
        res.status(201).json({ message: 'Quiz created', quiz });
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};

exports.getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await QuizService.getAll(req.query);
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};

exports.getQuizById = async (req, res) => {
    try {
        const quiz = await QuizService.getById(req.params.id);
        if (!quiz) return res.status(404).json({ error: 'NotFound', message: 'Quiz not found' });
        res.status(200).json(quiz);
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};

exports.updateQuiz = async (req, res) => {
    try {
        const quiz = await QuizService.update(req.params.id, req.body);
        if (!quiz) return res.status(404).json({ error: 'NotFound', message: 'Quiz not found' });
        res.status(200).json({ message: 'Quiz updated', quiz });
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

exports.startQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const { quiz, quizResult } = await QuizService.startQuiz(id, userId);
        if (!quiz) return res.status(404).json({ error: 'NotFound', message: 'Quiz not found' });
        res.status(200).json({ message: 'Quiz started', quiz, quizResult });
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};

exports.submitQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, answers, quizResult } = req.body;
        const result = await QuizService.submitQuiz(id, userId, answers, quizResult);
        if (!result) return res.status(404).json({ error: 'NotFound', message: 'Quiz not found' });
        res.status(200).json({ message: 'Quiz submitted', result });
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};
