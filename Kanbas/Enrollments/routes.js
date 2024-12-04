import * as enrollmentsDao from "./dao.js";
export default function EnrollmentRoutes(app) {
    // get all enrollments for user
    app.get("/api/enrollments/:userId", async (req, res) => {
        const { userId } = req.params;
        const enrollments = await enrollmentsDao.findCoursesForUser(userId);
        res.send(enrollments);
    });

    // enroll user in course
    app.post("/api/enrollments", async (req, res) => {
        const { user, course } = req.body;
        const newEnrollment = await enrollmentsDao.enrollUserInCourse(user, course);
        res.send(newEnrollment);
    });
}
