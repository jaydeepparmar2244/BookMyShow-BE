const express = require("express");
const {
  createShow,
  getAllShows,
  updateShow,
  deleteShow,
  getShowsByCity,
} = require("../controllers/showsController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new movie (Admin Only)
router.post("/new", protect, adminOnly, createShow);

// Get all movies (Public)
router.get("/", getAllShows);

// Get all movies (Public)
router.get("/city/:city", getShowsByCity);

// Get single movie by ID (Public)
// router.get("/:id", getMovieById);

// Update movie (Admin Only)
router.put("/:showId", protect, adminOnly, updateShow);

// Delete movie (Admin Only)
router.delete("/:showId", protect, adminOnly, deleteShow);

module.exports = router;
