const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  createBooking,
  getBookings,
  updateBooking,
  deleteBooking,
  getBooking,
} = require("../controllers/bookings");
const { protect, authorize } = require("../middleware/auth");

router.route("/").get(protect, getBookings).post(protect, createBooking);
router
  .route("/:id")
  .get(protect, getBooking)
  .put(protect, updateBooking)
  .delete(protect, deleteBooking);

module.exports = router;
