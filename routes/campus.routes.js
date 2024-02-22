const { CampusController } = require("../controllers");

const express = require("express");
const router = express.Router();

router.get("/", CampusController.getAll);
router.get("/:id", CampusController.getById);
router.get("/client/:id", CampusController.getByClient);
router.get("/school/:id", CampusController.getBySchoolId);
router.put("/create", CampusController.create);
router.patch("/update", CampusController.update);
router.delete("/:id", CampusController.delete);

module.exports = router;
