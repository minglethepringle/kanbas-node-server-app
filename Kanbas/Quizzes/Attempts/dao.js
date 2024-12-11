import model from "./model.js";
export function findNumberOfAttemptsForQuizAndUser(quizId, userId) {
    return model.countDocuments({ quizId, userId });
}

export function findLatestAttemptForQuizAndUser(quizId, userId) {
    return model.findOne({ quizId, userId }).sort({ datetime: -1 });
}

export function createAttempt(attempt) {
    return model.create(attempt);
}
