const express = require("express");
const {
  getCompanies,
  getCompany,
  getCompaniesbyDistance,
} = require("../controllers/companies");

// Include Booking router becuase it needs Companies Information (Populate)
const bookingRouter = require('./bookings');

const router = express.Router();

const { protect } = require("../middleware/auth");

router.use('/:companyId/bookings', bookingRouter);

router.route("/").get(getCompanies);
router.route("/:id").get(getCompany);
router.route("/search/dist").get(protect, getCompaniesbyDistance);

module.exports = router;
