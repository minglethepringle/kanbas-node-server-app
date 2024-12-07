import mongoose from "mongoose";
// TODO: MAY NEED TO EDIT THIS 
const quizSchema = new mongoose.Schema(
    {
        course: { type: mongoose.Schema.Types.ObjectId, ref: "CourseModel" },
        details: {
            title: String,
            description: String,
            quizType: {
                type: String,
                enum: ['Graded Quiz', 'Practice Quiz', 'Grade Survey', 'Ungraded Survey'],
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
        questions: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'QuestionModel', // Refers to the 'Question' model
        }]
    },
    { collection: "quizzes" }
);
export default quizSchema;