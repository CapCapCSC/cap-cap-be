const QuestionService = require('../services/questionService');

// ...existing code...
exports.createQuestion = async (req, res) => {
    try {
        const Question = await QuestionService.create(req.body);
        res.status(201).json({ message: 'Question created', Question });
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};

exports.getAllQuestions = async (req, res) => {
    try {
        const Questions = await QuestionService.getAll(req.query);
        res.status(200).json(Questions);
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};

exports.getQuestionById = async (req, res) => {
    try {
        const Question = await QuestionService.getById(req.params.id);
        if (!Question) return res.status(404).json({ error: 'NotFound', message: 'Question not found' });
        res.status(200).json(Question);
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};

exports.updateQuestion = async (req, res) => {
    try {
        const Question = await QuestionService.update(req.params.id, req.body);
        if (!Question) return res.status(404).json({ error: 'NotFound', message: 'Question not found' });
        res.status(200).json({ message: 'Question updated', Question });
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};

exports.deleteQuestion = async (req, res) => {
    try {
        const success = await QuestionService.delete(req.params.id);
        if (!success) return res.status(404).json({ error: 'NotFound', message: 'Question not found' });
        res.status(200).json({ message: 'Question deleted' });
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};
// ...existing code...
