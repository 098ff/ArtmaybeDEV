// Import model for using here!
const Company = require("../models/Company");
const User = require("../models/User");
const Booking = require("../models/Booking");

//@desc    Create Booking
//@route   POST /api/companies/:companyId/bookings
//@access  Private
exports.createBooking = async (req, res, next) => {
  try {
    // Prevent booking if admin
    if (req.user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin is not allowed to book interview sessions",
      });
    }

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

    //Check if date is within May 10–13, 2022
    const interviewDate = new Date(req.body.bookingDate);
    const startDate = new Date("2022-05-10");
    const endDate = new Date("2022-05-13");

    if (interviewDate < startDate || interviewDate > endDate) {
      return res.status(400).json({
        success: false,
        message: "Interview date must be between May 10 and May 13, 2022",
      });
    }

    //Add user to booking
    req.body.user = req.user.id;

    //Check for existing bookings
    const existingBookings = await Booking.find({ user: req.user.id });

    // Prevent booking if user already has 3 bookings
    if (existingBookings.length >= 3) {
      return res.status(400).json({
        success: false,
        message: `The user with ID ${req.user.id} has already made 3 bookings`,
      });
    }

    //add status field
    req.body.status = "pending";

    //create booking
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

//@desc     Get all bookings
//@route    GET /api/bookings
//@access   Private
exports.getBookings = async (req, res, next) => {
  let query;
  //General users can see only their bookings!
  if (req.user.role !== "admin") {
    query = Booking.find({ user: req.user.id })
      .populate({
        path: "company",
        select: "name address telephone",
      })
      .populate({ path: "user", select: "name email telephone" });
  } else {
    //If you are an admin, you can see all!
    if (req.params.companyId) {
      console.log(req.params.hospitalId);
      query = Booking.find({ company: req.params.companyId })
        .populate({
          path: "company",
          select: "name address telephone",
        })
        .populate({ path: "user", select: "name email telephone" });
    } else {
      query = Booking.find()
        .populate({
          path: "company",
          select: "name address telephone",
        })
        .populate({ path: "user", select: "name email telephone" });
    }
  }
  try {
    const bookings = await query;

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find Booking" });
  }
};

//@desc     Get single booking
//@route    GET /api/bookings/:id
//@access   Private
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: "company",
        select: "name address telephone",
      })
      .populate({ path: "user", select: "name email telephone" });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`,
      });
    }

    //check ownership
    if (
      booking.user._id.toString() !== req.user.id && req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to access this booking`,
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find Booking" });
  }
};

//@desc     Update booking
//@route    PUT /api/bookings/:id
//@access   Private
exports.updateBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`,
      });
    }

    //Check if date is within May 10–13, 2022
    const interviewDate = new Date(req.body.bookingDate);
    const startDate = new Date("2022-05-10");
    const endDate = new Date("2022-05-13");

    if (interviewDate < startDate || interviewDate > endDate) {
      return res.status(400).json({
        success: false,
        message: "Interview date must be between May 10 and May 13, 2022",
      });
    }

    // Make sure user is the booking owner
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this booking`,
      });
    }

    //if user want update status, only admin can do that
    if (req.body.status && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Only admin can update the status",
      });
    }

    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot update Booking" });
  }
};

//@desc     Delete booking
//@route    DELETE /api/bookings/:id
//@access   Private
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`,
      });
    }

    // Make sure user is the booking owner
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this booking`,
      });
    }

    await booking.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot delete Booking" });
  }
};
