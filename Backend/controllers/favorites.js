// Import model for using here!
const Company = require("../models/Company");
const User = require("../models/User");
const Favorite = require("../models/Favorite");

//@desc    Create Favorite
//@route   POST /api/v1/companies/:companyId/favorites
//@access  Private
exports.createFavorite = async (req, res, next) => {
  try {
    //Assign company from URL param
    req.body.company = req.params.companyId;

    //Check if company exists
    const company = await Company.findById(req.params.companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: `No company with the id of ${req.params.companyId}`,
      });
    }

    //declare a variable
    let duplicate;
    let populatedFavorite;

    //Add user to favorite
    req.body.user = req.user.id;

    //check if user already favorite this company
    const existed = await Favorite.findOne({
      user: req.user.id,
      company: req.params.companyId,
    });

    if (existed) {
      /*if already favorited return the exist one with duplicate = true*/
      populatedFavorite = await Favorite.find({
        favorite: existed._id,
      })
        .populate({ path: "company", select: "name" })
        .populate({ path: "user", select: "name" });
      duplicate = true;
    } else {
      /*else create new with duplicate = false*/
      const favorite = await Favorite.create(req.body);

      populatedFavorite = await Favorite.find({
        favorite: favorite._id,
      })
        .populate({ path: "company", select: "name" })
        .populate({ path: "user", select: "name" });
      duplicate = false;
    }
    res.status(duplicate ? 200 : 201).json({
      success: true,
      data: populatedFavorite,
      duplicate: duplicate,
    });
  } catch (err) {
    console.error(err.stack);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

//@desc     Delete Favorite
//@route    DELETE /api/v1/favorites/:id
//@access   Private
exports.deleteFavorite = async (req, res, next) => {
  try {
    const favorite = await Favorite.findById(req.params.id);

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: `No favorite with the id of ${req.params.id}`,
      });
    }

    // Make sure user is the owner
    if (favorite.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to unfavorite`,
      });
    }

    await favorite.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot unfavorite" });
  }
};

//@desc     Get single favorite
//@route    GET /api/v1/favorites/:id
//@access   Public
exports.getFavorite = async (req, res, next) => {
  try {
    const favorite = await Favorite.findById(req.params.id)
      .populate({
        path: "company",
        select: "name",
      })
      .populate({
        path: "user",
        select: "name",
      });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: `No favorite with the id of ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: favorite,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find favorite" });
  }
};
