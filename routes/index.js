// Local Imports
const schoolRoutes = require("./school.routes");
const adminRoutes = require("./admin.routes");
const clientRoutes = require("./client.routes");
const campusRoutes = require("./campus.routes");
const gradeRoutes = require("./grade.routes");
const teacherRoutes = require("./teacher.routes");
const teacherGradeRoutes = require("./teacherGrade.routes");
const studentRoutes = require("./student.routes");
const parentRoutes = require("./parent.routes")
const requestRoutes = require("./request.routes")
const notificationRoutes = require("./notification.routes")
const pushNotificationRoutes = require("./pushNotification.routes")
const cronJobRoutes = require("./cronJob.routes")
const dashboardRoutes = require("./dashboard.routes")
const planRoutes = require("./plan.routes")
const cmsRoutes = require("./cms.routes")
const contactRoutes = require("./contact.routes")
const guardRoutes = require("./guard.routes")

const express = require("express");
const router = express.Router();

class Router {
  static getRoutes = () => {
    // Routes
    router.use("/schools", schoolRoutes);
    router.use("/admins", adminRoutes);
    router.use("/clients", clientRoutes);
    router.use("/campuses", campusRoutes);
    router.use("/grades", gradeRoutes);
    router.use("/teachers", teacherRoutes);
    router.use("/teachersGrades", teacherGradeRoutes);
    router.use("/students", studentRoutes);
    router.use("/parents", parentRoutes);
    router.use("/requests", requestRoutes);
    router.use("/notifications", notificationRoutes);
    router.use("/pushNotifications", pushNotificationRoutes);
    router.use("/cronjob", cronJobRoutes);
    router.use("/dashboard", dashboardRoutes);
    router.use("/plans", planRoutes);
    router.use("/plans", planRoutes);
    router.use("/cms", cmsRoutes);
    router.use("/contacts", contactRoutes);
    router.use("/guards", guardRoutes);

    // default index route
    router.get("/", (_, res) => res.send("Welcome."));

    return router;
  };
}

module.exports = Router;
