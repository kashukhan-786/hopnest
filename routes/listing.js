const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const ListingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const Listing = require("../models/listing.js");

// "/" routes (INDEX + CREATE)
// router
//   .route("/")
//   .get(async (req, res) => {
//     const { category, search, minPrice, maxPrice } = req.query;

//     let conditions = [];

//     // CATEGORY FILTER
//     if (category && category !== "all") {
//       conditions.push({ category });
//     }

//     // SEARCH FILTER (location + title)
//     if (search && search.trim() !== "") {
//       conditions.push({
//         $or: [
//           { location: { $regex: search, $options: "i" } },
//           { title: { $regex: search, $options: "i" } },
//         ],
//       });
//     }

//     // PRICE FILTERS
//     if (minPrice || maxPrice) {
//       let priceFilter = {};
//       if (minPrice) priceFilter.$gte = Number(minPrice);
//       if (maxPrice) priceFilter.$lte = Number(maxPrice);
//       conditions.push({ price: priceFilter });
//     }

//     // FINAL FILTER
//     let filter = conditions.length > 0 ? { $and: conditions } : {};

//     const allListings = await Listing.find(filter);
//     res.render("listings/index", { allListings });
//   })

//   .post(
//     isLoggedIn,
//     upload.single("listing[image]"),
//     validateListing,
//     wrapAsync(ListingController.createListing)
//   );

// // New route
// router.get("/new", isLoggedIn, ListingController.renderNewForm);

// // "/:id" routes
// router
//   .route("/:id")
//   .get(wrapAsync(ListingController.showListing))
//   .put(
//     isLoggedIn,
//     isOwner,
//     upload.single("listing[image]"),
//     validateListing,
//     wrapAsync(ListingController.updateListing)
//   )
//   .delete(isLoggedIn, isOwner, wrapAsync(ListingController.destroyListing));

// router.get(
//   "/:id/edit",
//   isLoggedIn,
//   isOwner,
//   wrapAsync(ListingController.renderEditForm)
// );

// module.exports = router;
router
  .route("/")
  .get(wrapAsync(ListingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(ListingController.createListing)
  );

// new listing form
router.get("/new", isLoggedIn, ListingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(ListingController.showListing))
  .put(
    isLoggedIn,

    upload.single("listing[image]"),
    validateListing,
    wrapAsync(ListingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(ListingController.destroyListing));

router.get(
  "/:id/edit",
  isLoggedIn,

  wrapAsync(ListingController.renderEditForm)
);

module.exports = router;
