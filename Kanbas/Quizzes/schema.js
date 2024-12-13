import mongoose from "mongoose";
const quizSchema = new mongoose.Schema(
    {
        course: { type: mongoose.Schema.Types.ObjectId, ref: "CourseModel" },
        details: {
            title: String,
            description: String,
            quizType: {
                type: String,
                enum: ['Graded Quiz', 'Practice Quiz', 'Graded Survey', 'Ungraded Survey'],
                required: false,
            },
            points: Number,
            assignmentGroup: {
                type: String,
                enum: ['Quizzes', 'Exams', 'Assignments', 'Project'],
                required: false,
            },
            shuffleAnswers: Boolean,
            timeLimit: Number,
            multipleAttempts: Boolean,
            howManyAttempts: Number,
            showCorrectAnswers: Boolean,
            accessCode: String,
            oneQuestionAtATime: Boolean,
            webcamRequired: Boolean,
            lockQuestionsAfterAnswering: Boolean,
            dueDate: Date,
            availableDate: Date,
            untilDate: Date,
            published: Boolean,
        },
    },
    { collection: "quizzes" }
);
export default quizSchema;