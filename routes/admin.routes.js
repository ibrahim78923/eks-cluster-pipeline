const { AdminController } = require("../controllers");

const express = require("express");
const router = express.Router();

router.get("/", AdminController.getAll);
router.get("/:id", AdminController.getById);
router.put("/create", AdminController.create);
router.patch("/update", AdminController.update);
router.delete("/:id", AdminController.delete);

// ** Auth Routes
router.post("/login", AdminController.login);
router.patch("/update-password", AdminController.updatePassword);

module.exports = router;
