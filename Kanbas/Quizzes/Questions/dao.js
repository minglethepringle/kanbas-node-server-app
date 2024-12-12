import model from "./model.js";
export function findQuestionsForQuiz(quizId) {
    return model.find({ qid: quizId });
}

export function findQuestionById(questionId) {
    return model.findById(questionId);
}

export function createQuestion(question) {
    delete question._id;
    return model.create(question);
}

export function deleteQuestionsForQuiz(quizId) {
    return model.deleteMany({ qid: quizId });
}

export function saveQuestions(questions) {
    return model.insertMany(questions);
}