const express = require("express");
const {
  createTheatre,
  getAllTheatres,
  getTheatreById,
  updateTheatre,
  deleteTheatre,
} = require("../controllers/theatreController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new theatre (Admin Only)
router.post("/new", protect, adminOnly, createTheatre);

// Get all theatres (Public)
router.get("/", getAllTheatres);

// Get single theatre by ID (Public)
router.get("/:id", getTheatreById);

// Update theatre (Admin Only)
router.put("/:id", protect, adminOnly, updateTheatre);

// Delete theatre (Admin Only)
router.delete("/:id", protect, adminOnly, deleteTheatre);

module.exports = router;
