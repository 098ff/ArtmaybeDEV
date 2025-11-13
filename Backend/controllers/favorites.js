// Import model for using here!
const Company = require("../models/Company");
const Favorite = require("../models/Favorite");

//@desc    Create Favorite
//@route   POST /api/users/me/favorites
//@access  Private
exports.createFavorite = async (req, res, next) => {
  try {
    //Assign company from request body
    const companyId = req.body.companyId;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Please provide companyId in request body",
      });
    }

    //Check if company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: `No company with the id of ${req.body.companyId}`,
      });
    }

    //add user and company to body
    req.body.user = req.user.id;
    req.body.company = companyId;

    //check if user already favorite this company
    const existed = await Favorite.findOne({
      user: req.user.id,
      company: companyId,
    });

    //declare a variable
    let populatedFavorite;
    let duplicate;

    if (existed) {
      /*if already favorited return the exist one with duplicate = true*/
      populatedFavorite = await Favorite.findById(existed._id)
        .populate({ path: "company", select: "name" })
        .populate({ path: "user", select: "name" });
      duplicate = true;
    } else {
      /*else create new with duplicate = false*/
      const favorite = await Favorite.create(req.body);

      populatedFavorite = await Favorite.findById(favorite._id)
        .populate({ path: "company", select: "name" })
        .populate({ path: "user", select: "name" });
      duplicate = false;
    }
    res.status(duplicate ? 200 : 201).json({
      success: true,
      data: populatedFavorite,
      duplicate,
    });
  } catch (err) {
    console.error(err.stack);
    res.status(400).json({
      success: false,
      message: err.message || "Cannot create favorite",
    });
  }
};

//@desc     Delete Favorite
//@route    DELETE /api/users/me/favorites/:companyId
//@access   Private
exports.deleteFavorite = async (req, res, next) => {
  try {
    const favorite = await Favorite.findOne({
      user: req.user.id,
      company: req.params.companyId,
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: `No favorite found for company ${req.params.companyId}`,
      });
    }

    //delete
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

//@desc     Get all favorites
//@route    GET /api/users/me/favorites/
//@access   Private
exports.getFavorites = async (req, res, next) => {
  let query;

  //users can see only their favorites
  query = Favorite.find({ user: req.user.id }).populate({
    path: "company",
  });

  try {
    const favorite = await query;

    res.status(200).json({
      success: true,
      count: favorite.length,
      data: favorite,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find your Favorite company" });
  }
};
