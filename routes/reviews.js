// const express = require("express");
// const router = express.Router({ mergeParams: true });
// const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");

// const Review = require("../models/reviews.js");
// const Listing = require("../models/listing.js");

// const {
//   validateReview,
//   isLoggedIn,
//   isReviewAuthor,
// } = require("../middleware.js");
// const reviewController = require("../controllers/reviews.js");
// router.post(
//   "/",
//   isLoggedIn,
//   validateReview,
//   wrapAsync(reviewController.createReview)
// );

// router.delete(
//   "/:reviewId",
//   isLoggedIn,
//   isReviewAuthor,
//   wrapAsync(reviewController.destroyReview)
// );

// module.exports = router;
const express = require("express");
const router = express.Router({ mergeParams: true });

const Review = require("../models/review");
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware");

// CREATE REVIEW
router.post("/", isLoggedIn, async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);

  newReview.author = req.user._id;

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  res.redirect(`/listings/${listing._id}`);
});

// DELETE REVIEW
router.delete("/:reviewId", isLoggedIn, async (req, res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });

  await Review.findByIdAndDelete(reviewId);

  res.redirect(`/listings/${id}`);
});

module.exports = router;
