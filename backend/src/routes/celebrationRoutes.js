const express = require("express");
const router = express.Router();
const celebrationController = require("../controllers/celebrationController");
const upload = require("../config/cloudinary");
const { verifyToken } = require("../middleware/auth");

router.get("/celebrations", celebrationController.getCelebrations);
router.get("/celebrations/:id", celebrationController.getCelebrationById);
router.post("/celebrations", verifyToken, upload.fields([
  { name: 'images', maxCount: 20 },
  { name: 'audio', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), celebrationController.createCelebration);
router.put("/celebrations/:id", verifyToken, upload.fields([
  { name: 'images', maxCount: 20 },
  { name: 'audio', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), celebrationController.updateCelebration);
router.delete("/celebrations/:id", verifyToken, celebrationController.deleteCelebration);

module.exports = router;
