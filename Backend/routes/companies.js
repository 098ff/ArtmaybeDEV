const express = require("express");
const {
  getCompanies,
  getCompany,
  createCompany, 
  updateCompany, 
  deleteCompany,
  getCompaniesbyDistance,
} = require("../controllers/companies");

// Include Booking router becuase it needs Companies Information (Populate)
const bookingRouter = require('./bookings');

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router.use('/:companyId/bookings', bookingRouter);

router.route("/").get(getCompanies).post(protect, authorize('admin'), createCompany);
router.route("/:id").get(getCompany).put(protect, authorize('admin'), updateCompany).delete(protect, authorize('admin'), deleteCompany);
router.route("/search/dist").get(protect, getCompaniesbyDistance);

module.exports = router;
