const express = require("express");
const {
  createScreen,
  getAllScreens,
  getScreensByTheatre,
  updateScreen,
  deleteScreen,
} = require("../controllers/screenController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new screen (Admin Only)
router.post("/new", protect, adminOnly, createScreen);

// Get all screens (Public)
router.get("/", getAllScreens);

// Get screens by theatre ID (Public)
router.get("/theatre/:theatreId", getScreensByTheatre);

// Update a screen (Admin Only)
router.put("/:screenId", protect, adminOnly, updateScreen);

// Delete a screen (Admin Only)
router.delete("/:screenId", protect, adminOnly, deleteScreen);

module.exports = router;
