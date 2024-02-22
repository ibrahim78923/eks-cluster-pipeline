const { TeacherController } = require("../controllers");

const express = require("express");
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const MulterS3 = require("../middlewares/MulterS3");
const { teacherUploader: uploader } = new MulterS3().getUploader();

router.get("/", TeacherController.getAll);
router.get("/:id", TeacherController.getById);
router.get("/web/:id", TeacherController.getByIdWeb);
router.get("/sendEmail/:id", TeacherController.sendEmail);
router.post("/bulkSendEmail", TeacherController.bulkSendEmail);
router.get("/client/:id", TeacherController.getByClient);
router.get("/web/client/:id", TeacherController.getByClientWeb);
router.get("/aliasToken/:id", TeacherController.aliasToken);
router.get("/getStudent/:id", TeacherController.getStudent);
router.get("/school/:id", TeacherController.getBySchoolId);
router.put("/create", TeacherController.simpleCreate);
router.patch("/update", TeacherController.update);
router.delete("/:id", TeacherController.delete);
router.post("/verifyToken", TeacherController.verifyToken);
// ** Auth Routes
router.post("/loginByUsername", TeacherController.login);
router.patch("/update-password", TeacherController.updatePassword);

router.post("/loginByEmail", TeacherController.loginByEmail);
router.get("/auth/google", TeacherController.loginByEmailWeb);
router.post("/forgot-password", TeacherController.forgotPassword);
router.post("/forgot-password-check", TeacherController.forgotPasswordCheck);
router.get('/auth/google/callback',TeacherController.loginByEmailWebCallback);
router.get('/auth/google/verifyGoogleToken',TeacherController.verifyGoogleToken);

router.put('/import', upload.single('csvFile'), TeacherController.import);

router.post(
    "/upload-pfp",
    uploader.single("pfp"),
    TeacherController.updateProfile
);
router.post(
    "/create",
    uploader.single("profileUrl"),
    TeacherController.create
);

module.exports = router;
