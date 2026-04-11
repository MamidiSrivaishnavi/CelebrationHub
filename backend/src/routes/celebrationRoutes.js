const express = require("express");
const router = express.Router();
const celebrationController = require("../controllers/celebrationController");

router.get("/celebrations", celebrationController.getCelebrations);
router.post("/celebrations", celebrationController.createCelebration);
router.put("/celebrations/:id", celebrationController.updateCelebration);
router.delete("/celebrations/:id", celebrationController.deleteCelebration);

module.exports = router;
