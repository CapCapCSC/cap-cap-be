const Quiz = require('../models/quiz');
const QuizResultService = require('../models/quizResultService');

exports.create = async (data) => {
    return await Quiz.create(data);
};

exports.getAll = async (query) => {
    const { page = 1, limit = 10, tags } = query;
    const filter = tags ? { tags: { $in: tags.split(',') } } : {};
    const quizzes = await Quiz.find(filter)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
    const total = await Quiz.countDocuments(filter);
    return { data: quizzes, pagination: { page, limit, total } };
};

exports.getById = async (id) => {
    return await Quiz.findById(id).populate('questions');
};

exports.update = async (id, data) => {
    return await Quiz.findByIdAndUpdate(id, data, { new: true });
};

exports.delete = async (id) => {
    const result = await Quiz.findByIdAndDelete(id);
    return !!result;
};

exports.startQuiz = async (id, userId) => {
    const quiz = await Quiz.findById(id).populate('questions');
    if (!quiz) return null;
    const quizResult = await QuizResultService.create({
        userId,
        quizId: id,
        startedAt: new Date(),
    });
    return { quiz, quizResult };
};

exports.submitQuiz = async (id, userId, answers, quizResultId) => {
    const quiz = await Quiz.findById(id).populate('questions');
    if (!quiz) return null;

    let score = 0;
    const total = quiz.questions.length;

    const correctAnswers = quiz.questions.map((question) => {
        const userAnswer = answers.find((answer) => answer.questionId === question._id.toString());
        const isCorrect = userAnswer && question.correctAnswer === userAnswer.answer;
        if (isCorrect) score++;
        return {
            questionId: question._id,
            isCorrect,
        };
    });

    const percentageScore = total > 0 ? Math.floor((score / total) * 100) : 0;

    const quizResult = await QuizResultService.updateWhenSubmitted(
        quizResultId,
        { score: percentageScore, submittedAt: new Date() },
    );

    return { userId, score, total, correctAnswers, quizResult };
};
