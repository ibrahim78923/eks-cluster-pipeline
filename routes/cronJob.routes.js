const { CronJobController } = require("../controllers");

const express = require("express");
const router = express.Router();

router.get("/", CronJobController.welcome);
router.get("/password", CronJobController.passwordChange);
router.get("/offTimeReminderSend", CronJobController.offTimeReminderSend);
router.get("/startTimeReminderSend", CronJobController.startTimeReminderSend);
router.get("/delete", CronJobController.delete);
router.get("/addGradeTime", CronJobController.addGradeTime);
router.get("/addClientId", CronJobController.addClientId);
router.get("/addTeacherGrade", CronJobController.addTeacherGrade);
router.get("/createRequest", CronJobController.createRequest);
router.get("/addStudent", CronJobController.addStudent);
router.get("/addTestStudent", CronJobController.addTestStudent);

module.exports = router;
