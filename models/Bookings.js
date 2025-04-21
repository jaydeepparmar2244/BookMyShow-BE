const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookingsSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },
    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shows",
      required: [true, "Show ID is required"],
    },
    number_of_seats: {
      type: Number,
      required: [true, "Number of seats is required"],
      min: [1, "At least one seat must be booked"],
    },
    show_date: {
      type: Date,
      required: [true, "Show date is required"],
    },
    total_amount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [1, "Total amount must be at least 1"],
    },
    status: {
      type: String,
      enum: ["Confirmed", "Pending", "Cancelled"],
      default: "Confirmed",
    },
    booking_reference: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  { timestamps: true }
);

// Generate a unique booking reference before saving
BookingsSchema.pre("save", async function (next) {
  if (!this.booking_reference) {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    this.booking_reference = `BK${timestamp}${random}`;
  }
  next();
});

module.exports = mongoose.model("Bookings", BookingsSchema);
