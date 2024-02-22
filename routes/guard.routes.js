const { guardController } = require("../controllers");

const express = require("express");
const router = express.Router();

router.get("/", guardController.getAll);
router.get("/:id", guardController.getById);
router.get("/hasEmail/:id", guardController.hasEmail);
router.put("/create", guardController.create);
router.patch("/update", guardController.update);
router.delete("/:id", guardController.delete);
router.get("/client/:id", guardController.getByClient);

router.post("/loginByUsername", guardController.loginByUsername);
router.post("/loginByEmail", guardController.loginByEmail);
router.patch("/update-password", guardController.updatePassword);
router.post("/forgot-password", guardController.forgotPassword);
router.post("/forgot-password-check", guardController.forgotPasswordCheck);
router.post("/verifyToken", guardController.verifyToken);

module.exports = router;
