const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      requires: [true, "Please add a user"],
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      requires: [true, "Please add a company"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Favorite", FavoriteSchema);