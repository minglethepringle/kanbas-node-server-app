import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
    {
        quiz: { type: mongoose.Schema.Types.ObjectId, ref: "QuizModel" },
        questionType: {
            type: String,
            enum: ["Multiple Choice", "True False", "Fill in the Blank"],
            required: true,
        },
        title: String,
        points: Number,
        question: String,
        properties: mongoose.Schema.Types.Mixed,
    },
    { collection: "questions" }
);
export default questionSchema;
