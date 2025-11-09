const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  createFavorite,
  deleteFavorite,
  getFavorites,
} = require("../controllers/favorites");
const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(protect, authorize("user"), getFavorites)
  .post(protect, authorize("user"), createFavorite);
router.route("/:companyId").delete(protect, authorize("user"), deleteFavorite);

module.exports = router;
