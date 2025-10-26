const express = require("express");
const router = express.Router({ mergeParams: true });
const { createBooking } = require("../controllers/bookings");

router.route("/").post(createBooking);

module.exports = router;
