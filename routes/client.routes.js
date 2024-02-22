const { ClientController } = require("../controllers");

const express = require("express");
const router = express.Router();

router.get("/", ClientController.getAll);
router.get("/:id", ClientController.getById);
router.get("/status/:clientId", ClientController.status);
router.put("/create", ClientController.create);
router.patch("/update", ClientController.update);
router.delete("/:id", ClientController.delete);

//** stripe payment
router.post('/paymentIntent', ClientController.paymentIntent)
router.post('/createSubscription', ClientController.createSubscription)
router.post('/createFreeTrialSubscription', ClientController.createFreeTrialSubscription)
router.post('/cancelSubscription', ClientController.cancelSubscription)
router.post('/updateSubscriptionInvoice', ClientController.updateSubscriptionInvoice)
router.post('/updateSubscription', ClientController.updateSubscription)
router.post('/billing', ClientController.billing)

// ** Auth Routes
router.post("/login", ClientController.login);
router.post("/verifyToken", ClientController.verifyToken);
router.post("/verifyUser", ClientController.verifyUser);
router.post("/sendNotification", ClientController.sendNotification);
router.post("/sendEmail", ClientController.sendEmail);
router.post("/forgotPassword", ClientController.forgotPassword);
router.patch("/update-password", ClientController.updatePassword);
router.post("/forgot-password-check", ClientController.forgotPasswordCheck);

module.exports = router;
