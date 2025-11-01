const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    bookingDate: {
      type: Date,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please add a user name"],
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Please select a company"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      /*dosent know if we would like the company to have ability to reject or accept booking
      if doesnt need can delete this*/
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Booking", BookingSchema);
