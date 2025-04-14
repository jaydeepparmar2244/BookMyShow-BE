const Movie = require("../models/Movies");

// Create a new movie
const createMovie = async (req, res) => {
  try {
    const posterUrl = req.file?.path; // Cloudinary URL
    const movie = new Movie({
      ...req.body,
      image: posterUrl,
    });
    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all movies
const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single movie by ID
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a movie
const updateMovie = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file?.path) {
      updateData.image = req.file.path;
    }

    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedMovie)
      return res.status(404).json({ message: "Movie not found" });

    res.json(updatedMovie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a movie
const deleteMovie = async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
    if (!deletedMovie)
      return res.status(404).json({ message: "Movie not found" });
    res.json({ message: "Movie deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
};
