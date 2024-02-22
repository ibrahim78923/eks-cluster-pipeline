const { NotificationController } = require("../controllers");

const express = require("express");
const router = express.Router();

const MulterS3 = require("../middlewares/MulterS3");
const { notificationUploader: uploader } = new MulterS3().getUploader();

router.get("/teachers/:id", NotificationController.getAllByTeachers);
router.get("/parents/:id", NotificationController.getAllByParents);
router.get("/student/:id", NotificationController.getByStudent);
router.get("/:id", NotificationController.getById);
// router.put("/create", NotificationController.create);
router.patch("/update", NotificationController.update);
router.delete("/:id", NotificationController.delete);
router.get("/client/:id", NotificationController.getByClient);

router.post(
    "/create",
    uploader.single("imageUrl"),
    NotificationController.create
);
router.post(
    "/bulkCreate",
    uploader.single("imageUrl"),
    NotificationController.bulkCreate
);

module.exports = router;
