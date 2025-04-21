const mongoose = require("mongoose");
const Booking = require("../models/Bookings");
const Show = require("../models/Shows");

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { show, seats, total_amount, name, email, phone, number_of_seats, show_date } = req.body;

    // Validate required fields
    if (!show || !seats || !total_amount || !name || !email || !phone || !number_of_seats || !show_date) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields"
      });
    }

    // Validate date format
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
    if (!dateRegex.test(show_date)) {
      return res.status(400).json({
        success: false,
        error: "Date must be in DD-MM-YYYY format"
      });
    }

    // Check if show exists
    const existingShow = await Show.findById(show);
    if (!existingShow) {
      return res.status(404).json({
        success: false,
        error: "Show not found"
      });
    }

    // Check seat availability
    if (existingShow.available_seats < seats.length) {
      return res.status(400).json({
        success: false,
        error: "Not enough seats available"
      });
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user?._id, // Optional user ID if user is logged in
      show,
      seats,
      total_amount,
      name,
      email,
      phone,
      number_of_seats,
      show_date,
      status: "Confirmed"
    });

    // Update available seats
    existingShow.available_seats -= seats.length;
    await existingShow.save();

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error("Booking creation error:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "A booking with these details already exists"
      });
    }
    res.status(500).json({
      success: false,
      error: error.message || "Failed to create booking"
    });
  }
};

// Get all bookings for a user
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ 
      $or: [
        { user: req.user._id },
        { email: req.user.email }
      ]
    })
      .populate("show", "show_time price_per_seat")
      .populate({
        path: "show",
        populate: [
          { path: "movie", select: "movie_name image" },
          { path: "theatre", select: "theatre_name city" },
          { path: "screen", select: "screen_name screen_type" }
        ]
      })
      .sort({ createdAt: -1 });
    
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single booking
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("show", "show_time price_per_seat")
      .populate({
        path: "show",
        populate: [
          { path: "movie", select: "movie_name image" },
          { path: "theatre", select: "theatre_name city" },
          { path: "screen", select: "screen_name screen_type" }
        ]
      });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Check if user is authorized to view this booking
    const isAuthorized = booking.user?.toString() === req.user._id.toString() || 
                        booking.email === req.user.email || 
                        req.user.role === "admin";

    if (!isAuthorized) {
      return res.status(403).json({ error: "Not authorized to view this booking" });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancel a booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Check if user is authorized to cancel this booking
    const isAuthorized = booking.user?.toString() === req.user._id.toString() || 
                        booking.email === req.user.email || 
                        req.user.role === "admin";

    if (!isAuthorized) {
      return res.status(403).json({ error: "Not authorized to cancel this booking" });
    }

    // Check if booking can be cancelled
    if (booking.status === "Cancelled") {
      return res.status(400).json({ error: "Booking is already cancelled" });
    }

    // Update booking status
    booking.status = "Cancelled";
    await booking.save();

    // Update available seats in show
    const show = await Show.findById(booking.show);
    show.available_seats += booking.number_of_seats;
    await show.save();

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all bookings (Admin only)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("show", "show_time price_per_seat")
      .populate({
        path: "show",
        populate: [
          { path: "movie", select: "movie_name" },
          { path: "theatre", select: "theatre_name city" },
          { path: "screen", select: "screen_name" }
        ]
      })
      .sort({ createdAt: -1 });
    
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  getAllBookings
}; 