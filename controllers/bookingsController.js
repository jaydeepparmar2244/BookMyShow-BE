const mongoose = require("mongoose");
const Booking = require("../models/Bookings");
const Show = require("../models/Shows");

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      show, 
      number_of_seats, 
      show_date, 
      total_amount 
    } = req.body;
    
    // Check if show exists and has enough seats
    const showDetails = await Show.findById(show);
    if (!showDetails) {
      return res.status(404).json({ error: "Show not found" });
    }
    
    if (showDetails.available_seats < number_of_seats) {
      return res.status(400).json({ error: "Not enough seats available" });
    }

    // Validate show date
    const bookingDate = new Date(show_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (bookingDate < today) {
      return res.status(400).json({ error: "Cannot book for past dates" });
    }

    // Create booking
    const booking = new Booking({
      name,
      email,
      phone,
      show,
      number_of_seats,
      show_date,
      total_amount,
      user: req.user?._id // Optional, if user is logged in
    });

    // Update available seats in show
    showDetails.available_seats -= number_of_seats;
    await showDetails.save();
    
    const savedBooking = await booking.save();
    
    // Populate show details for response
    const populatedBooking = await Booking.findById(savedBooking._id)
      .populate("show", "show_time price_per_seat")
      .populate({
        path: "show",
        populate: [
          { path: "movie", select: "movie_name image" },
          { path: "theatre", select: "theatre_name city" },
          { path: "screen", select: "screen_name screen_type" }
        ]
      });

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(400).json({ error: error.message });
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