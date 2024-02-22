const { GradeController } = require("../controllers");

const express = require("express");
const router = express.Router();

router.get("/", GradeController.getAll);
router.get("/:id", GradeController.getById);
router.get("/web/:id", GradeController.getByIdWeb);
router.get("/web/client/:id", GradeController.getByClientWeb);
router.get("/client/:id", GradeController.getByClient);
router.get("/school/:id", GradeController.getBySchool);
router.get("/web/school/:id", GradeController.getBySchoolWeb);
router.get("/teacher/:id", GradeController.getByTeacher);
router.get("/getStudent/teacher", GradeController.getStudentByTeacher);
router.put("/create", GradeController.create);
router.put("/createGradeTime", GradeController.createGradeTime);
router.patch("/update", GradeController.update);
router.patch("/gradeTimeUpdate", GradeController.gradeTimeUpdate);
router.delete("/:id", GradeController.delete);
router.delete("/gradeTime/:id", GradeController.gradeTimeDelete);

module.exports = router;
