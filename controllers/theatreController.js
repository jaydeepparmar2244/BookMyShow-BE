const Theatre = require("../models/Theatres");

// Create a new theatre
const createTheatre = async (req, res) => {
  try {
    const theatre = new Theatre(req.body);
    await theatre.save();
    res.status(201).json(theatre);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all theatres
const getAllTheatres = async (req, res) => {
  try {
    const theatres = await Theatre.find();
    res.json(theatres);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single theatre by ID
const getTheatreById = async (req, res) => {
  try {
    const theatre = await Theatre.findById(req.params.id);
    if (!theatre) return res.status(404).json({ message: "Theatre not found" });
    res.json(theatre);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a theatre
const updateTheatre = async (req, res) => {
  try {
    const updatedTheatre = await Theatre.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedTheatre)
      return res.status(404).json({ message: "Theatre not found" });
    res.json(updatedTheatre);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a theatre
const deleteTheatre = async (req, res) => {
  try {
    const deletedTheatre = await Theatre.findByIdAndDelete(req.params.id);
    if (!deletedTheatre)
      return res.status(404).json({ message: "Theatre not found" });
    res.json({ message: "Theatre deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTheatre,
  getAllTheatres,
  getTheatreById,
  updateTheatre,
  deleteTheatre,
};
