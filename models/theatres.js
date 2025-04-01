const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TheatresSchema = new Schema(
  {
    theatre_name: {
      type: String,
      required: [true, "Theatre name is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      minlength: [3, "Location must be at least 3 characters long"],
    },
    total_screens: {
      type: Number,
      required: [true, "Total screens are required"],
      min: [1, "There must be at least 1 screen"],
      max: [100, "Total screens cannot exceed 100"],
    },
    contact_person: {
      type: String,
      required: [true, "Contact person name is required"],
      trim: true,
    },
    contact_number: {
      type: String, // Allowing different formats, not restricting to 10 digits
      required: [true, "Contact number is required"],
      match: [/^\+?[0-9\s-]{7,15}$/, "Enter a valid contact number"],
    },
    contact_email: {
      type: String,
      required: [true, "Contact email is required"],
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    facilities: {
      type: [String],
      enum: [
        "IMAX",
        "4DX",
        "Dolby Atmos",
        "VIP Lounge",
        "Recliner Seats",
        "Parking",
        "Food Court",
        "Wheelchair Accessible",
        "3D Screen",
        "Online Booking",
      ],
      default: [],
    },
    seating_capacity: {
      type: Number,
      required: [true, "Seating capacity is required"],
      min: [50, "Minimum seating capacity is 50"],
      max: [5000, "Seating capacity cannot exceed 5000"],
    },
    ratings: {
      type: Number,
      min: [0, "Ratings cannot be negative"],
      max: [5, "Ratings cannot exceed 5"],
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Theatres", TheatresSchema);
