const Show = require("../models/Shows");

// Create a new screen
const createShow = async (req, res) => {
  try {
    const newShow = new Show(req.body);
    const savedShow = await newShow.save();
    res.status(201).json(savedShow);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all screens
const getAllShows = async (req, res) => {
  try {
    const shows = await Screen.find().populate("movie", "theatre");
    res.status(200).json(shows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get screens by theatre ID
const getShowsOfTheatre = async (req, res) => {
  try {
    const screens = await Screen.find({
      theatre_id: req.params.theatreId,
    }).populate("theatre_id");
    res.status(200).json(screens);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a screen
const updateShow = async (req, res) => {
  try {
    const updatedShow = await Show.findByIdAndUpdate(
      req.params.showId,
      req.body,
      { new: true }
    );
    if (!updatedShow) return res.status(404).json({ error: "Show not found" });
    res.status(200).json(updatedShow);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a screen
const deleteShow = async (req, res) => {
  try {
    const deletedShow = await Screen.findByIdAndDelete(req.params.showId);
    if (!deletedShow) return res.status(404).json({ error: "Show not found" });
    res.status(200).json({ message: "Show deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createShow,
  getAllScreens,
  getScreensByTheatre,
  updateShow,
  deleteShow,
};
