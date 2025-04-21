const mongoose = require("mongoose");

const BookingsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: false,
    },
    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shows",
      required: true,
    },
    seats: {
      type: [String],
      required: true,
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: "At least one seat must be selected",
      },
    },
    total_amount: {
      type: Number,
      required: true,
      min: 1,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    number_of_seats: {
      type: Number,
      required: true,
      min: 1,
    },
    show_date: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^\d{2}-\d{2}-\d{4}$/.test(v);
        },
        message: "Date must be in DD-MM-YYYY format"
      }
    },
    booking_reference: {
      type: String,
      unique: true,
      required: true,
    },
    status: {
      type: String,
      enum: ["Confirmed", "Pending", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

// Generate a unique booking reference before saving
BookingsSchema.pre("save", async function (next) {
  if (!this.booking_reference) {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.booking_reference = `BMS${timestamp}${random}`;
  }
  next();
});

module.exports = mongoose.model("Bookings", BookingsSchema);
