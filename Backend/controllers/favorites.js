// Import model for using here!
const Company = require("../models/Company");
const User = require("../models/User");
const Favorite = require("../models/Favorite");

//@desc    Create Booking
//@route   POST /api/v1/companies/:companyId/bookings
//@access  Private
exports.createFavorite = async (req, res, next) => {
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

    //Add user to favorite
    req.body.user = req.user.id;

    const favorites = await Favorite.create(req.body);

    res.status(201).json({
      success: true,
      data: favorites,
    });
  } catch (err) {
    console.error(err.stack);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
