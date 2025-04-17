const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ShowsSchema = new Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movies",
      required: [true, "Movie ID is required"],
    },
    theatre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theatres",
      required: [true, "Theatre ID is required"],
    },
    screen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Screens",
      required: [true, "Screen ID is required"],
    },
    show_time: {
      type: Date,
      required: [true, "Show time is required"],
    },
    available_seats: {
      type: Number,
      required: true,
      min: [1, "There must be at least 1 available seat"],
    },
    total_seats: {
      type: Number,
      required: true,
    },
    price_per_seat: {
      type: Number,
      required: true,
      min: [1, "Price per seat must be at least 1"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shows", ShowsSchema);
