const mongoose = require("mongoose");
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
    const shows = await Show.find()
      .populate("movie", "movie_name")
      .populate("theatre", "theatre_name city")
      .populate("screen", "screen_name");
    res.status(200).json(shows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get screens by a city
const getShowsByCity = async (req, res) => {
  const { city } = req.params;

  try {
    const shows = await Show.aggregate([
      {
        $lookup: {
          from: "theatres",
          localField: "theatre",
          foreignField: "_id",
          as: "theatreDetails",
        },
      },
      { $unwind: "$theatreDetails" },
      {
        $match: {
          "theatreDetails.city": city,
        },
      },
      {
        $lookup: {
          from: "movies",
          localField: "movie",
          foreignField: "_id",
          as: "movieDetails",
        },
      },
      { $unwind: "$movieDetails" },
      {
        $lookup: {
          from: "screens",
          localField: "screen",
          foreignField: "_id",
          as: "screenDetails",
        },
      },
      { $unwind: "$screenDetails" },
      {
        $project: {
          movie_name: "$movieDetails.movie_name",
          image: "$movieDetails.image",
          language: "$movieDetails.language",
          description: "$movieDetails.description",
          release_date: "$movieDetails.release_date",
          rating: "$movieDetails.rating",
          genre: "$movieDetails.genre",
          theatre_name: "$theatreDetails.theatre_name",
          city: "$theatreDetails.city",
          screen_name: "$screenDetails.screen_name",
          screen_type: "$screenDetails.screen_type",
          show_time: "$show_time",
          available_seats: 1,
          price_per_seat: 1,
        },
      },
    ]);

    res.status(200).json(shows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMoviesByCity = async (req, res) => {
  const { city } = req.params;

  try {
    const movies = await Show.aggregate([
      {
        $lookup: {
          from: "theatres",
          localField: "theatre",
          foreignField: "_id",
          as: "theatreDetails",
        },
      },
      { $unwind: "$theatreDetails" },
      {
        $match: {
          "theatreDetails.city": city,
        },
      },
      {
        $group: {
          _id: "$movie",
        },
      },
      {
        $lookup: {
          from: "movies",
          localField: "_id",
          foreignField: "_id",
          as: "movieDetails",
        },
      },
      { $unwind: "$movieDetails" },
      {
        $project: {
          movieId: "$movieDetails._id",
          movie_name: "$movieDetails.movie_name",
          image: "$movieDetails.image",
          language: "$movieDetails.language",
          description: "$movieDetails.description",
          release_date: "$movieDetails.release_date",
          rating: "$movieDetails.rating",
          genre: "$movieDetails.genre",
        },
      },
    ]);

    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getShowsByMovieInCity = async (req, res) => {
  const { movieId, city } = req.params;

  try {
    const shows = await Show.aggregate([
      {
        $match: {
          movie: new mongoose.Types.ObjectId(movieId),
        },
      },
      {
        $lookup: {
          from: "theatres",
          localField: "theatre",
          foreignField: "_id",
          as: "theatreDetails",
        },
      },
      { $unwind: "$theatreDetails" },
      {
        $match: {
          "theatreDetails.city": city,
        },
      },
      {
        $lookup: {
          from: "movies",
          localField: "movie",
          foreignField: "_id",
          as: "movieDetails",
        },
      },
      { $unwind: "$movieDetails" },
      {
        $lookup: {
          from: "screens",
          localField: "screen",
          foreignField: "_id",
          as: "screenDetails",
        },
      },
      { $unwind: "$screenDetails" },
      {
        $project: {
          available_seats: 1,
          price_per_seat: 1,
          theatre_name: "$theatreDetails.theatre_name",
          city: "$theatreDetails.city",
          screen_name: "$screenDetails.screen_name",
          screen_type: "$screenDetails.screen_type",
          show_time: "$show_time",
          movieDetails: {
            movie_name: "$movieDetails.movie_name",
            image: "$movieDetails.image",
            language: "$movieDetails.language",
            description: "$movieDetails.description",
            release_date: "$movieDetails.release_date",
            rating: "$movieDetails.rating",
            genre: "$movieDetails.genre",
          },
        },
      },
      {
        $group: {
          _id: "$movieDetails",
          shows: {
            $push: {
              _id: "$_id",
              available_seats: "$available_seats",
              price_per_seat: "$price_per_seat",
              theatre_name: "$theatre_name",
              city: "$city",
              screen_name: "$screen_name",
              screen_type: "$screen_type",
              show_time: "$show_time",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          movie: "$_id",
          shows: 1,
        },
      },
    ]);

    res.status(200).json(shows[0]);
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
    const deletedShow = await Show.findByIdAndDelete(req.params.showId);
    if (!deletedShow) return res.status(404).json({ error: "Show not found" });
    res.status(200).json({ message: "Show deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createShow,
  getAllShows,
  updateShow,
  deleteShow,
  getShowsByCity,
  getMoviesByCity,
  getShowsByMovieInCity,
};
