const { GuardianController } = require("../controllers");

const express = require("express");
const router = express.Router();

router.get("/", GuardianController.getAll);
router.get("/:id", GuardianController.getById);
router.get("/hasEmail/:userName", GuardianController.hasEmail);
router.put("/create", GuardianController.create);
router.patch("/update", GuardianController.update);
router.delete("/:id", GuardianController.delete);

router.post("/loginByUsername", GuardianController.loginByUsername);
router.post("/loginByEmail", GuardianController.loginByEmail);
router.patch("/update-password", GuardianController.updatePassword);
router.post("/forgot-password", GuardianController.forgotPassword);
router.post("/verifyToken", GuardianController.verifyToken);

module.exports = router;
