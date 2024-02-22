const { ContactController } = require("../controllers");

const express = require("express");
const router = express.Router();

router.get("/", ContactController.getAll);
router.get("/:id", ContactController.getById);
router.put("/create", ContactController.create);
router.patch("/update", ContactController.update);
router.delete("/:id", ContactController.delete);



module.exports = router;
