const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookingsSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "User ID is required"],
    },
    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shows",
      required: [true, "Show ID is required"],
    },
    seats: {
      type: [String],
      required: [true, "Seats must be selected"],
      validate: {
        validator: (seats) => seats.length > 0,
        message: "At least one seat must be selected",
      },
    },
    total_price: {
      type: Number,
      required: true,
      min: [1, "Total price must be at least 1"],
    },
    status: {
      type: String,
      enum: ["Confirmed", "Pending", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bookings", BookingsSchema);
