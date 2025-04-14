const express = require("express");
const {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
} = require("../controllers/movieController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const parser = require("../middleware/multer"); // path to your multer setup

const router = express.Router();

// Create a new movie (Admin Only)
router.post("/new", parser.single("image"), protect, adminOnly, createMovie);

// Get all movies (Public)
router.get("/", getAllMovies);

// Get single movie by ID (Public)
router.get("/:id", getMovieById);

// Update movie (Admin Only)
router.put("/:id", parser.single("image"), protect, adminOnly, updateMovie);

// Delete movie (Admin Only)
router.delete("/:id", protect, adminOnly, deleteMovie);

module.exports = router;
