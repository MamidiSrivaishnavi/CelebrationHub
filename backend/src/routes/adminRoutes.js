const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/admin/users", adminController.getAllUsers);
router.delete("/admin/users/:id", adminController.deleteUser);
router.get("/admin/celebrations", adminController.getAllCelebrationsAdmin);
router.delete("/admin/celebrations/:id", adminController.deleteCelebrationAdmin);

module.exports = router;
