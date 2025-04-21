const express = require("express");
const {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  getAllBookings
} = require("../controllers/bookingsController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new booking (Protected)
router.post("/", protect, createBooking);

// Get all bookings for current user (Protected)
router.get("/my-bookings", protect, getUserBookings);

// Get a single booking (Protected)
router.get("/:id", protect, getBookingById);

// Cancel a booking (Protected)
router.put("/:id/cancel", protect, cancelBooking);

// Get all bookings (Admin only)
router.get("/", protect, adminOnly, getAllBookings);

module.exports = router; 