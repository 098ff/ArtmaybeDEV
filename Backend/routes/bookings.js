const express = require("express");
const router = express.Router({ mergeParams: true });
const { createBooking } = require("../controllers/bookings");
const { protect } = require("../middleware/auth");

router.route("/").post(protect, createBooking);

module.exports = router;
