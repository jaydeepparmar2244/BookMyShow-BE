const Screen = require("../models/Screens");

// Create a new screen
const createScreen = async (req, res) => {
  try {
    const newScreen = new Screen(req.body);
    const savedScreen = await newScreen.save();
    res.status(201).json(savedScreen);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all screens
const getAllScreens = async (req, res) => {
  try {
    const screens = await Screen.find().populate(
      "theatre_id",
      "theatre_name location"
    );
    res.status(200).json(screens);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get screens by theatre ID
const getScreensByTheatre = async (req, res) => {
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
const updateScreen = async (req, res) => {
  try {
    const updatedScreen = await Screen.findByIdAndUpdate(
      req.params.screenId,
      req.body,
      { new: true }
    );
    if (!updatedScreen)
      return res.status(404).json({ error: "Screen not found" });
    res.status(200).json(updatedScreen);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a screen
const deleteScreen = async (req, res) => {
  try {
    const deletedScreen = await Screen.findByIdAndDelete(req.params.screenId);
    if (!deletedScreen)
      return res.status(404).json({ error: "Screen not found" });
    res.status(200).json({ message: "Screen deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createScreen,
  getAllScreens,
  getScreensByTheatre,
  updateScreen,
  deleteScreen,
};
