const express = require("express");
const router = express.Router({ mergeParams: true });
const { createFavorite } = require("../controllers/favorites");
const { protect, authorize } = require("../middleware/auth");

router.route("/").post(protect, authorize("user"), createFavorite);

module.exports = router;
