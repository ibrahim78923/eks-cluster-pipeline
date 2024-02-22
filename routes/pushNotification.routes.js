const { PushNotificationController } = require("../controllers");

const express = require("express");
const router = express.Router();


router.get("/teachers/:id", PushNotificationController.getAllByTeachers);
router.get("/parents/:id", PushNotificationController.getAllByParents);
router.get("/student/:id", PushNotificationController.getByStudent);
router.get("/:id", PushNotificationController.getById);
router.put("/create", PushNotificationController.create);
router.patch("/update", PushNotificationController.update);
router.delete("/:id", PushNotificationController.delete);



module.exports = router;
