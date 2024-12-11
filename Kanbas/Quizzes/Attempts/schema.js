import mongoose from "mongoose";

const attemptsSchema = new mongoose.Schema(
    {
        datetime: Date,
        quizId: { type: mongoose.Schema.Types.ObjectId, ref: "QuizModel" },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel" },
        score: Number,
        answers: [
            {
                questionId: { type: mongoose.Schema.Types.ObjectId, ref: "QuestionModel" },
                studentAnswer: String,
                correctAnswer: String,
            },
        ],
    },
    { collection: "attempts" }
);
export default attemptsSchema;
