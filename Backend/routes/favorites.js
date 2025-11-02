const express = require("express");
const router = express.Router({ mergeParams: true });
const { createFavorite, deleteFavorite } = require("../controllers/favorites");
const { protect, authorize } = require("../middleware/auth");

router.route("/").post(protect, authorize("user"), createFavorite);
router.route("/:id").delete(protect, authorize("user"), deleteFavorite);

module.exports = router;
