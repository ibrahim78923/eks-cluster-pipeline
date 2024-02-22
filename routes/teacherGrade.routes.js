const { TeacherGradeController } = require("../controllers");

const express = require("express");
const router = express.Router();

router.get("/", TeacherGradeController.getAll);
router.get("/:id", TeacherGradeController.getById);
router.put("/create", TeacherGradeController.create);
router.patch("/update", TeacherGradeController.update);
router.delete("/:id", TeacherGradeController.delete);

module.exports = router;
