const express = require("express");
const {
  getVehicles,
  addVehicle,
  updateVehicle,
  getVehicleById
} = require("../controllers/vehicleController");
const { auth, admin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", getVehicles);
router.post("/", auth, admin, addVehicle);
router.put("/:id", auth, admin, updateVehicle);
router.get("/:id", getVehicleById);

module.exports = router;
