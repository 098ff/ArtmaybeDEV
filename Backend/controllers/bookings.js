// Import model for using here!
const Company = require("../models/Company");
const User = require("../models/User");
const Booking = require("../models/Booking");

//@desc    Create Booking
//@route   POST /api/v1/companies/:companyId/bookings
//@access  Private
exports.createBooking = async (req, res, next) => {
  try {
    //Assign company from URL param
    req.body.company = req.params.companyId;

    //Check if company exists
    const company = await Company.findById(req.params.companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: `No company with the id of ${req.params.companyId}`,
      });
    }

    //Add user to booking
    req.body.user = req.user.id;

    //Optional
    /*
    const existingBookings = await Booking.find({ user: req.user.id });
    if (existingBookings.length >= 3 && req.user.role !== "admin") {
      return res.status(400).json({
        success: false,
        message: `The user with ID ${req.user.id} has already made 3 bookings`,
      });
    }
    */

    const booking = await Booking.create(req.body);

    //Populate user & company fields
    const populatedBooking = await Booking.findById(booking._id)
      .populate("user", "name email telephone")
      .populate("company", "name address telephone");

    res.status(201).json({
      success: true,
      data: populatedBooking,
    });
  } catch (err) {
    console.error(err.stack);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
