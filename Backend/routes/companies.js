const express = require("express");
const {
  getCompanies,
  getCompany,
  getCompaniesbyDistance,
} = require("../controllers/companies");

// TODO : Implement Booking populate data from Company
// Include Booking router becuase it needs Companies Information (Populate)
// const bookingRouter = require('./bookings');

const router = express.Router();

const { protect } = require("../middleware/auth");

// TODO : Re-router to populate caller router (Booking)
// router.use('/:companyId/bookings', bookingRouter);

router.route("/").get(getCompanies);
router.route("/:id").get(getCompany);
router.route("/search/dist").get(protect, getCompaniesbyDistance);

module.exports = router;
