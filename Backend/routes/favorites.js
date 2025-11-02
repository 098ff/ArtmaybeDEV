const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  createFavorite,
  deleteFavorite,
  getFavorite,
} = require("../controllers/favorites");
const { protect, authorize } = require("../middleware/auth");

router.route("/").post(protect, authorize("user"), createFavorite);
router
  .route("/:id")
  .get(protect, getFavorite)
  .delete(protect, authorize("user"), deleteFavorite);

module.exports = router;
