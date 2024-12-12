import * as attemptsDao from "./dao.js";
import * as quizDao from "../dao.js";
import * as questionsDao from "../Questions/dao.js";

export default function AttemptsRoutes(app) {
    // Number of attempts for a quiz and user
    app.get("/api/quizzes/:quizId/attempts/:userId", async (req, res) => {
        const { quizId, userId } = req.params;
        const numberOfAttempts = await attemptsDao.findNumberOfAttemptsForQuizAndUser(quizId, userId);
        res.json({ numberOfAttempts });
    });

    // Get latest attempt for a quiz and user
    app.get("/api/quizzes/:quizId/attempts/:userId/latest", async (req, res) => {
        const { quizId, userId } = req.params;
        let latestAttempt = await attemptsDao.findLatestAttemptForQuizAndUser(quizId, userId);
        if (!latestAttempt) {
            res.json(null);
            return;
        }
        let questionsMap = {};
        let questions = await questionsDao.findQuestionsForQuiz(quizId);
        questions.forEach(q => {
            questionsMap[q._id] = q;
        });
        console.log("##### QUESTIONS MAP: ");
        console.log(questionsMap);
        latestAttempt = latestAttempt.toJSON();
        console.log("##### LATEST ATTEMPT: ");
        console.log(latestAttempt);
        latestAttempt.answers = latestAttempt.answers.map(answer => {
            return {
                ...answer,
                question: questionsMap[answer.questionId],
            };
        });
    
        res.json(latestAttempt);
    });

    // PUT quiz submission
    app.put("/api/quizzes/:quizId/submit", async (req, res) => {
        const { quizId } = req.params;
        const attempt = req.body;

        /*
        Submission structure:
         {
            userId: ID,
            answers: { questionId: ID, studentAnswer: string }[]
        }

        Want to store:
         {
            _id: ID,
            datetime: string (yyyy-mm-dd hh:mm:ss),
            quizId: ID,
            userId: ID,
            score: number,
            answers: { questionId: ID, studentAnswer: string, correctAnswers: string[] }[]
        }

        Question structure:
        Question = {
            _id: ID,
            qid: ID,
            questionType: ["Multiple Choice", "True False", "Fill in the Blank"],
            title: string,
            points: number,
            question: string,
            properties: {
                choices: {
                    id: number;
                    text: string;
                    isCorrect: boolean;
                }[]
            }
        }
        */

        // create a dictionary of question id to the right answers
        // { questionId: { ...question, correctAnswers: string[] } }
        const questions = await questionsDao.findQuestionsForQuiz(quizId);
        let questionMap = {};

        questions.forEach(q => {
            const question = q.toJSON();
            const correctAnswers = question.properties.choices.filter(choice => choice.isCorrect).map(choice => choice.text);
            questionMap[question._id] = {
                ...question,
                correctAnswers
            }
        });

        // console.log(questionMap);

        // Grade each answer
        let score = 0;
        let gradedAnswers = attempt.answers.map(answer => {
            // Look up correct answers
            const question = questionMap[answer.questionId];
            const correctAnswers = question.correctAnswers.map(answer => answer.toLowerCase());
            // Compare case insensitive
            const isCorrect = correctAnswers.includes(answer.studentAnswer.toLowerCase());
            // Increment score
            if (isCorrect) {
                score += question.points;
            }

            // Return graded answer
            return {
                questionId: answer.questionId,
                studentAnswer: answer.studentAnswer.toLowerCase(),
                correctAnswers: correctAnswers,
            };
        });

        // Save attempt
        const savedAttempt = {
            datetime: new Date().toISOString(),
            quizId,
            userId: attempt.userId,
            score,
            answers: gradedAnswers,
        };

        // console.log("##### ATTEMPT SAVING: ");
        // console.log(savedAttempt);

        await attemptsDao.createAttempt(savedAttempt);
        
        res.send(200);
    });
}