const { ParentController } = require("../controllers");

const express = require("express");
const router = express.Router();

router.get("/", ParentController.getAll);
router.get("/:id", ParentController.getById);
router.get("/assistant/:parentId", ParentController.getAssistantById);
router.get("/hasEmail/:userName", ParentController.hasEmail);
router.put("/create", ParentController.create);
router.put("/createGuardian", ParentController.createGuardian);
router.patch("/update", ParentController.update);
router.patch("/updateGuardian", ParentController.updateGuardian);
router.delete("/:id", ParentController.delete);
router.delete("/guardian/:id", ParentController.deleteGuardian);
router.get("/client/:id", ParentController.getByClient);

router.post("/loginByUsername", ParentController.loginByUsername);
router.post("/loginByEmail", ParentController.loginByEmail);
router.patch("/update-password", ParentController.updatePassword);
router.post("/forgot-password", ParentController.forgotPassword);
router.post("/forgot-password-check", ParentController.forgotPasswordCheck);
router.post("/verifyToken", ParentController.verifyToken);

module.exports = router;
