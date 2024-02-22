const SchoolController = require("./school.controller");
const AdminController = require("./admin.controller");
const ClientController = require("./client.controller");
const CampusController = require("./campus.controller");
const GradeController = require("./grade.controller");
const TeacherController = require("./teacher.controller");
const TeacherGradeController = require("./teacherGrade.controller");
const StudentController = require("./student.controller");
const ParentController = require("./parent.controller");
const RequestController = require("./request.controller");
const NotificationController = require("./notification.controller");
const PushNotificationController = require("./pushNotification.controller");
const CronJobController = require("./cronJob.controller");
const DashboardController = require("./dashboardController");
const PlanController = require("./plan.controller");
const CmsController = require("./cms.controller");
const ContactController = require("./contact.controller");
const guardController = require("./guard.controller");


module.exports = {
  SchoolController,
  AdminController,
  ClientController,
  CampusController,
  GradeController,
  TeacherController,
  TeacherGradeController,
  StudentController,
  ParentController,
  RequestController,
  NotificationController,
  PushNotificationController,
  CronJobController,
  DashboardController,
  PlanController,
  CmsController,
  ContactController,
  guardController
};
