const express = require("express");
const {
  createShow,
  getAllShows,
  updateShow,
  deleteShow,
  getShowsByCity,
  getShowsByMovieInCity,
  getMoviesByCity,
} = require("../controllers/showsController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new movie (Admin Only)
router.post("/new", protect, adminOnly, createShow);

// Get all movies (Public)
router.get("/", getAllShows);

// Get all shows (Public)
router.get("/city/:city", getShowsByCity);

//Get all movie shows
router.get("/movies/:city", getMoviesByCity);

// Get Shows by Movie in City
router.get("/:movieId/:city", getShowsByMovieInCity);

// Update movie (Admin Only)
router.put("/:showId", protect, adminOnly, updateShow);

// Delete movie (Admin Only)
router.delete("/:showId", protect, adminOnly, deleteShow);

module.exports = router;
