const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ScreensSchema = new Schema(
  {
    theatre_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theatres",
      required: [true, "Theatre ID is required"],
    },
    screen_name: {
      type: String,
      required: [true, "Screen name is required"],
      trim: true,
    },
    screen_type: {
      type: String,
      enum: ["IMAX", "4DX", "2D", "3D", "Dolby Atmos"],
      required: [true, "Screen type is required"],
    },
    seating_capacity: {
      type: Number,
      required: [true, "Seating capacity is required"],
      min: [50, "Screen must have at least 50 seats"],
    },
    facilities: {
      type: [String],
      enum: [
        "Recliner Seats",
        "Wheelchair Accessible",
        "VIP Lounge",
        "Food Service",
        "Online Booking",
      ],
      default: [],
    },
    show_timings: [
      {
        start_time: { type: String, required: true }, // Format: "HH:mm AM/PM"
        end_time: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Screens", ScreensSchema);
