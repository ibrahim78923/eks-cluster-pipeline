const { PlanController } = require("../controllers");

const express = require("express");
const router = express.Router();

router.get("/:id", PlanController.getById);
router.patch("/update", PlanController.update);
router.delete("/:id", PlanController.delete);
router.get("/", PlanController.getAll);

router.post(
    "/create",
    PlanController.create
);

module.exports = router;
