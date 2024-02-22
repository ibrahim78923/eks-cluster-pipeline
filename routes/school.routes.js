const { SchoolController } = require("../controllers");

const express = require("express");
const router = express.Router();

const MulterS3 = require("../middlewares/MulterS3");
const { schoolUploader: uploader } = new MulterS3().getUploader();

router.get("/", SchoolController.getAll);
router.get("/client/:id", SchoolController.getByClient);
router.get("/web/client/:id", SchoolController.getByClientWeb);
router.get("/:id", SchoolController.getById);
router.put("/create", SchoolController.simpleCreate);
router.patch("/update", SchoolController.update);
router.delete("/:id", SchoolController.delete);
router.post(
    "/upload-pfp",
    uploader.single("pfp"),
    SchoolController.updateProfile
);
router.post(
    "/create",
    uploader.single("profileUrl"),
    SchoolController.create
);

module.exports = router;
