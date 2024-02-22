const { CmsController } = require("../controllers");

const express = require("express");
const router = express.Router();
const MulterS3 = require("../middlewares/MulterS3");
const { cmsUploader: uploader } = new MulterS3().getUploader();

router.get("/:id", CmsController.getById);
router.patch("/update", CmsController.update);
router.delete("/feature/:id", CmsController.featureDelete);
router.delete("/:id", CmsController.delete);
router.get("/", CmsController.getAll);
router.post("/create",CmsController.create);
router.patch("/featureUpdate",CmsController.featureUpdate);
router.post(
    "/upload-image",
    uploader.single("pfp"),
    CmsController.uploadImage
);
router.post(
    "/featureCreate",
    uploader.single("image"),
    CmsController.featureCreate
);

module.exports = router;
