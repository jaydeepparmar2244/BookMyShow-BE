const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MoviesSchema = new Schema(
  {
    movie_name: {
      type: String,
      required: [true, "Movie name is required"],
      trim: true,
    },
    release_date: {
      type: Date,
      required: [true, "Release date is required"],
    },
    genre: {
      type: [String],
      required: [true, "Genre is required"],
      enum: [
        "Action",
        "Comedy",
        "Drama",
        "Horror",
        "Romance",
        "Sci-Fi",
        "Thriller",
        "Animation",
        "Documentary",
      ],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [10, "Description must be at least 10 characters long"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    language: {
      type: String,
      required: [true, "Language is required"],
      enum: [
        "English",
        "Hindi",
        "Spanish",
        "French",
        "German",
        "Japanese",
        "Chinese",
        "Korean",
        "Other",
      ],
    },
    rating: {
      type: Number,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot be more than 10"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movies", MoviesSchema);
