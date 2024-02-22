const { RequestController } = require("../controllers");

const express = require("express");
const router = express.Router();

router.get("/", RequestController.getAll);
router.get("/client/:id", RequestController.getByClient);
router.get("/student/:id", RequestController.getByStudent);
// router.get("/parent/:id", RequestController.getByParent);
router.get("/parent/:id", RequestController.getAllWithDates);
router.get("/grade/:id", RequestController.getAllByGrades);
router.get("/:id", RequestController.getById);
router.put("/create", RequestController.create);
router.put("/createApprove", RequestController.createApprove);
router.patch("/update", RequestController.update);
router.delete("/:id", RequestController.delete);



router.get("/students/:studentId", RequestController.getBySingleStudent);
router.get("/guards/:guardId", RequestController.getBySingleGuard);
router.get("/grades/:gradeId", RequestController.getBygrade);
router.get("/schools/:schoolId", RequestController.getBySchool);

module.exports = router;
