import * as quizzesDao from "./dao.js";
import * as questionsDao from "./Questions/dao.js";
export default function QuizRoutes(app) {
    // for quizzes
    app.get("/api/courses/:courseId/quizzes", async (req, res) => {
        const { courseId } = req.params;
        let quizzes = await quizzesDao.findQuizzesForCourse(courseId);
        // For each quiz, find questions
        quizzes = await Promise.all(quizzes.map(async (quiz) => {
            const questions = await questionsDao.findQuestionsForQuiz(quiz._id);
            return {
                ...quiz.toJSON(),
                questions,
            };
        }));
        res.json(quizzes);
    });
    app.post("/api/courses/:courseId/quizzes", async (req, res) => {
        const { courseId } = req.params;
        const quiz = {
            ...req.body,
            course: courseId,
        };
        const newQuiz = await quizzesDao.createQuiz(quiz);
        res.json(newQuiz);
    });

    app.delete("/api/quizzes/:quizId", async (req, res) => {
        const { quizId } = req.params;
        const status = await quizzesDao.deleteQuiz(quizId);
        // Delete questions for the quiz
        await questionsDao.deleteQuestionsForQuiz(quizId);
        res.send(status);
    });
    app.put("/api/quizzes/:quizId", async (req, res) => {
        const { quizId } = req.params;
        const quizUpdates = req.body;
        // Extract questions array from quizUpdates
        const questions = quizUpdates.questions;
        // Delete questions array from quizUpdates
        delete quizUpdates.questions;
        const status = await quizzesDao.updateQuiz(quizId, quizUpdates);
        // Update questions
        if (questions) {
            await questionsDao.deleteQuestionsForQuiz(quizId);
            await questionsDao.saveQuestions(questions);
        }
        res.send(status);
    });
    app.put("/api/quizzes/:quizId/publish", async (req, res) => {
        const { quizId } = req.params;
        await quizzesDao.publishQuiz(quizId);
        const updatedQuiz = await quizzesDao.findQuizById(quizId);
        // For each quiz, find questions
        const questions = await questionsDao.findQuestionsForQuiz(quizId);
        res.json({
            ...updatedQuiz.toJSON(),
            questions,
        });
    });

    app.put("/api/quizzes/:quizId/unpublish", async (req, res) => {
        const { quizId } = req.params;
        await quizzesDao.unpublishQuiz(quizId);
        const updatedQuiz = await quizzesDao.findQuizById(quizId);
        // For each quiz, find questions
        const questions = await questionsDao.findQuestionsForQuiz(quizId);
        res.json({
            ...updatedQuiz.toJSON(),
            questions,
        });
    });
}
