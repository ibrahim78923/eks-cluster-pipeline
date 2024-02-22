const { StudentController } = require("../controllers");

const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const MulterS3 = require("../middlewares/MulterS3");
const { studentUploader: uploader } = new MulterS3().getUploader();

router.get("/", StudentController.getAll);
router.get("/:id", StudentController.getById);
router.get("/getTeacherId/:id", StudentController.getTeacherId);
router.get("/sendEmail/:id", StudentController.sendEmail);
router.get("/promoteStudent/:gradeId", StudentController.promoteStudent);
router.post("/bulkSendEmail", StudentController.bulkSendEmail);
router.get("/client/:id", StudentController.getByClient);
router.get("/grade/:id", StudentController.getByGrade);
router.get("/parent/:id", StudentController.getByParent);
// router.put("/addSibling", StudentController.addSibling);
router.put("/create", StudentController.create);
router.patch("/update", StudentController.update);
router.delete("/:id", StudentController.delete);
router.put('/import', upload.single('csvFile'), StudentController.import);




router.post(
    "/create",
    uploader.single("profileUrl"),
    StudentController.create
);
router.post(
    "/add-Sibling",
    uploader.single("profileUrl"),
    StudentController.addSibling
);

router.post(
  "/upload-pfp",
  uploader.single("pfp"),
  StudentController.updateProfile
);

module.exports = router;
