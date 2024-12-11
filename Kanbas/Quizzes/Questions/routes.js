import * as questionDao from "./dao.js";

export default function QuestionRoutes(app) {
    app.post("/api/quizzes/:quizId/questions", async (req, res) => {
        const { quizId } = req.params;
        const questionData = req.body;
        questionData.quiz = quizId;

        const newQuestion = await questionDao.createQuestion(questionData);
        res.status(201).json(newQuestion);
    });

    app.get("/api/quizzes/:quizId/questions", async (req, res) => {
        const { quizId } = req.params;
        const questions = await questionDao.findQuestionsForQuiz(quizId);
        res.status(200).json(questions);
    });

    app.get("/api/quizzes/:quizId/questions/:questionId", async (req, res) => {
        const { quizId, questionId } = req.params;
        const question = await questionDao.findQuestionById(questionId);
        if (!question || question.quiz.toString() !== quizId) {
            return res.status(404).json({ message: "Question not found for this quiz" });
        }
        res.status(200).json(question);
    });

    app.put("/api/quizzes/:quizId/questions/:questionId", async (req, res) => {
        const { quizId, questionId } = req.params;
        const questionUpdates = req.body;

        const status = await questionDao.updateQuestion(questionId, questionUpdates);
        if (status.nModified === 0) {
            return res.status(404).json({ message: "Question not found or does not belong to this quiz" });
        }
        res.status(200).json(status);
    });

    app.delete("/api/quizzes/:quizId/questions/:questionId", async (req, res) => {
        const { quizId, questionId } = req.params;
        const status = await questionDao.deleteQuestion(questionId);
        if (status.deletedCount === 0) {
            return res.status(404).json({ message: "Question not found or does not belong to this quiz" });
        }
        res.status(200).json({ message: "Question deleted successfully" });
    });
}
