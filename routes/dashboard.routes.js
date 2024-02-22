const {  DashboardController } = require("../controllers");

const express = require("express");
const router = express.Router();


router.get("/client/:id", DashboardController.dashboard);

module.exports = router;
